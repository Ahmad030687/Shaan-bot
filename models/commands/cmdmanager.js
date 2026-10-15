
/**
 * Shaan Bot - Command & Event Manager
 * Path: models/commands/cmdmanager.js
 * Repository: Ahmad030687/Shaan-bot
 * Credits: SARDAR RDX
 * Powered by: AHMAD RDX
 */

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const commandsDir = __dirname;
const eventsDir = path.join(__dirname, "../events");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "Ahmad030687/Shaan-bot";
const GITHUB_BRANCH = "main";

const githubHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "AHMAD-RDX-Bot"
};

// GitHub par file ka SHA lena
async function getGithubSha(repoPath) {
  if (!GITHUB_TOKEN) return null;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`,
      {
        headers: githubHeaders,
        params: { ref: GITHUB_BRANCH }
      }
    );

    return response.data.sha;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// GitHub par file create/update karna
async function pushGithub(repoPath, content, message) {
  if (!GITHUB_TOKEN) {
    return {
      success: false,
      message: "GITHUB_TOKEN missing"
    };
  }

  try {
    const sha = await getGithubSha(repoPath);

    const payload = {
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: GITHUB_BRANCH
    };

    // Existing file update karne ke liye SHA required hai
    if (sha) payload.sha = sha;

    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`,
      payload,
      { headers: githubHeaders }
    );

    return {
      success: true,
      message: "GitHub sync successful"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
}

// Name ko safe filename banana
function cleanName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "");
}

// JavaScript syntax check
function validateCode(code) {
  try {
    new Function(code);
    return true;
  } catch (error) {
    return error.message;
  }
}

// Local file safely save karna
async function saveFile(filePath, code) {
  const tempPath = `${filePath}.tmp`;

  await fs.writeFile(tempPath, code, "utf8");
  await fs.rename(tempPath, filePath);
}

// Existing command ko running bot mein reload karna
function reloadCommand(filePath) {
  try {
    const resolved = require.resolve(filePath);

    delete require.cache[resolved];

    const command = require(resolved);

    if (!command.config || !command.config.name) {
      throw new Error("Command config.name missing");
    }

    const name = command.config.name.toLowerCase();

    global.client.commands =
      global.client.commands || new Map();

    global.client.aliases =
      global.client.aliases || new Map();

    global.client.commands.set(name, command);

    if (Array.isArray(command.config.aliases)) {
      for (const alias of command.config.aliases) {
        global.client.aliases.set(
          alias.toLowerCase(),
          name
        );
      }
    }

    return {
      success: true,
      name
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Existing event ko reload karna
function reloadEvent(filePath) {
  try {
    const resolved = require.resolve(filePath);

    delete require.cache[resolved];

    const event = require(resolved);

    if (!event.config || !event.config.name) {
      throw new Error("Event config.name missing");
    }

    global.client.events =
      global.client.events || new Map();

    global.client.events.set(
      event.config.name.toLowerCase(),
      event
    );

    return {
      success: true,
      name: event.config.name
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports.config = {
  name: "cmdmanager",
  aliases: [
    "addcmd",
    "editcmd",
    "addevt",
    "editevt"
  ],
  version: "11.0.0",
  permission: 2,
  credits: "SARDAR RDX",
  description: "Command and Event Manager by AHMAD RDX",
  commandCategory: "system",
  cooldowns: 1
};

module.exports.run = async function ({
  api,
  event,
  args
}) {
  const { threadID, messageID, body, messageReply } = event;

  const prefix = (global.config && global.config.PREFIX) || ".";

  const action = String(args[0] || "").toLowerCase();

  const isEvent = ["addevt", "editevt"].includes(action);

  const isAdd = ["addcmd", "addevt"].includes(action);

  const type = isEvent ? "Event" : "Command";

  const directory = isEvent ? eventsDir : commandsDir;

  const repoDirectory = isEvent
    ? "models/events"
    : "models/commands";

  if (!action) {
    return api.sendMessage(
      `╭━━━〔 COMMAND MANAGER 〕━━━╮\n\n` +
      `New command:\n${prefix}addcmd name\n\n` +
      `Edit command:\n${prefix}editcmd name\n` +
      `Code par reply karein.\n\n` +
      `New event:\n${prefix}addevt name\n\n` +
      `Edit event:\n${prefix}editevt name\n\n` +
      `GitHub: ${GITHUB_REPO}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      messageID
    );
  }

  const name = cleanName(args[1]);

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    return api.sendMessage(
      `Invalid name!\nExample: ${prefix}${action} hello`,
      threadID,
      messageID
    );
  }

  const fileName = `${name}.js`;
  const localPath = path.join(directory, fileName);
  const githubPath = `${repoDirectory}/${fileName}`;

  await fs.ensureDir(directory);

  // ADD command/event: bot prompt bhejega
  if (isAdd && !messageReply && args.length === 2) {
    return api.sendMessage(
      `╭━━━〔 ${type.toUpperCase()} ADD 〕━━━╮\n\n` +
      `Name: ${name}\n` +
      `File: ${fileName}\n\n` +
      `Ab is message par REPLY karke\n` +
      `apna complete JavaScript code paste karein.\n\n` +
      `Code ko alag message mein bhejein.\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
      threadID,
      (error, info) => {
        if (error || !info) return;

        // Prompt ID memory mein store
        global.cmdManagerPending =
          global.cmdManagerPending || new Map();

        global.cmdManagerPending.set(
          info.messageID,
          {
            name,
            isEvent,
            threadID: String(threadID)
          }
        );
      },
      messageID
    );
  }

  // EDIT command: existing file show karna
  if (!isAdd && !messageReply && args.length === 2) {
    if (!(await fs.pathExists(localPath))) {
      return api.sendMessage(
        `${type} file nahi mili: ${fileName}`,
        threadID,
        messageID
      );
    }

    const oldCode = await fs.readFile(localPath, "utf8");

    return api.sendMessage(
      `Existing ${type}: ${fileName}\n\n` +
      `Neeche code hai:\n\n${oldCode}\n\n` +
      `Edit karne ke liye is message par reply karein ` +
      `aur naya complete code paste karein.`,
      threadID,
      messageID
    );
  }

  // Code message reply ya direct code
  let code = "";

  if (messageReply && body) {
    code = String(body).trim();
  } else if (args.length >= 3) {
    const firstSpace = body.indexOf(" ");
    const secondSpace = body.indexOf(" ", firstSpace + 1);

    if (secondSpace !== -1) {
      code = body.substring(secondSpace + 1).trim();
    }
  }

  if (!code) {
    return api.sendMessage(
      `Code missing!\n` +
      `Example: ${prefix}${action} ${name} <complete code>`,
      threadID,
      messageID
    );
  }

  // Syntax validation
  const syntax = validateCode(code);

  if (syntax !== true) {
    return api.sendMessage(
      `❌ JavaScript syntax error:\n${syntax}\n\n` +
      `File save nahi hui.`,
      threadID,
      messageID
    );
  }

  // Command/Event config validation
  let tempModule;

  try {
    tempModule = { exports: {} };

    const wrapped = new Function(
      "module",
      "exports",
      "require",
      code
    );

    wrapped(tempModule, tempModule.exports, require);

    if (
      !tempModule.exports.config ||
      !tempModule.exports.config.name
    ) {
      throw new Error("module.exports.config.name missing");
    }

    if (!isEvent && typeof tempModule.exports.run !== "function") {
      throw new Error("module.exports.run function missing");
    }

  } catch (error) {
    return api.sendMessage(
      `❌ Code validation failed:\n${error.message}\n\n` +
      `File save nahi hui.`,
      threadID,
      messageID
    );
  }

  // Save file
  try {
    await saveFile(localPath, code);
  } catch (error) {
    return api.sendMessage(
      `File save error:\n${error.message}`,
      threadID,
      messageID
    );
  }

  // Running bot mein reload
  const loaded = isEvent
    ? reloadEvent(localPath)
    : reloadCommand(localPath);

  // GitHub sync
  const github = await pushGithub(
    githubPath,
    code,
    `${isAdd ? "Add" : "Update"} ${githubPath} via cmdmanager`
  );

  return api.sendMessage(
    `╭━━━〔 ${type.toUpperCase()} SAVED 〕━━━╮\n\n` +
    `📁 File: ${repoDirectory}/${fileName}\n` +
    `⚡ Runtime Load: ${loaded.success ? "SUCCESS ✅" : "FAILED ⚠️"}\n` +
    `☁️ GitHub: ${github.success ? "SUCCESS ✅" : "FAILED ⚠️"}\n\n` +
    `${loaded.success ? "" : "Load error: " + loaded.message + "\n"}` +
    `${github.success ? "" : "GitHub error: " + github.message + "\n"}` +
    `👑 AHMAD RDX\n` +
    `╰━━━━━━━━━━━━━━━━━━━━╯`,
    threadID,
    messageID
  );
};
    
