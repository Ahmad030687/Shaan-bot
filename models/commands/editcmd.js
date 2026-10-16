/**
 * Command & Event Manager Engine with Unsend Magic & GitHub Sync
 * Path: models/commands/cmdmanager.js
 * Target Repo: Ahmad030687/Shaan-bot
 * Location: models/commands & models/events
 * Credits: SARDAR RDX (Strictly preserved)
 * Upgraded & Powered by: AHMAD RDX
 */

const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const commandsDir = path.join(__dirname);
const eventsDir = path.join(__dirname, "..", "events");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "Ahmad030687/Shaan-bot";
const GITHUB_BRANCH = "main";

async function pushToGithub(filePathInRepo, content, commitMessage, sha = null) {
  if (!GITHUB_TOKEN) return false;
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePathInRepo}`;
    const payload = {
      message: commitMessage,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: GITHUB_BRANCH
    };
    if (sha) payload.sha = sha;

    await axios.put(url, payload, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AHMAD-RDX-Bot'
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function getGithubFileSha(filePathInRepo) {
  if (!GITHUB_TOKEN) return null;
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePathInRepo}?ref=${GITHUB_BRANCH}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AHMAD-RDX-Bot'
      }
    });
    return response.data.sha;
  } catch (e) {
    return null;
  }
}

function registerModuleToBot(localFilePath, isEvent = false) {
  try {
    if (require.cache[require.resolve(localFilePath)]) {
      delete require.cache[require.resolve(localFilePath)];
    }
    const pull = require(localFilePath);
    global.client = global.client || {};

    if (isEvent) {
      global.client.events = global.client.events || new Map();
      if (pull.config && pull.config.name) {
        global.client.events.set(pull.config.name.toLowerCase(), pull);
        return true;
      }
    } else {
      global.client.commands = global.client.commands || new Map();
      global.client.aliases = global.client.aliases || new Map();
      if (pull.config && pull.config.name) {
        const cmdName = pull.config.name.toLowerCase();
        global.client.commands.set(cmdName, pull);
        if (pull.config.aliases && Array.isArray(pull.config.aliases)) {
          pull.config.aliases.forEach(alias => {
            global.client.aliases.set(alias.toLowerCase(), cmdName);
          });
        }
        return true;
      }
    }
  } catch (err) {
    console.error("[AHMAD RDX Load Error]:", err.message);
  }
  return false;
}

module.exports.config = {
  name: "cmdmanager",
  version: "11.0.0",
  hasPermssion: 2,
  credits: "SARDAR RDX", // Strict core credit preserved
  description: "Command/Event editor with unsend and GitHub sync by AHMAD RDX",
  commandCategory: "System",
  usages: ".editcmd [command_name]",
  cooldowns: 2,
  aliases: ["editcmd", "addcmd", "cmd", "editevt", "addevt", "evt"]
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, body } = event;
  const cleanBody = (body || "").trim();
  const firstWord = cleanBody.split(/\s+/)[0].toLowerCase();

  const isEventMode = ["editevt", "addevt", "evt"].some(alias => firstWord.includes(alias));
  const targetType = isEventMode ? "Event" : "Command";
  const targetDir = isEventMode ? eventsDir : commandsDir;
  const repoSubDir = isEventMode ? "models/events" : "models/commands";

  if (!fs.existsSync(commandsDir)) fs.mkdirSync(commandsDir, { recursive: true });
  if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });

  const commandName = args[0];
  if (!commandName) {
    return api.sendMessage(
      `✦━━━ ❪ 💡 COMMAND MANAGER ❫ ━━━✦\n\n` +
      `📌 **Usage:**\n` +
      `👉 .editcmd <command_name>\n` +
      `👉 .editevt <event_name>\n\n` +
      `👑 **POWERED BY AHMAD RDX**`,
      threadID,
      messageID
    );
  }

  const fileNameOnly = commandName.toLowerCase().trim().replace(/\.js$/, "");
  const fileName = `${fileNameOnly}.js`;
  const filePath = path.join(targetDir, fileName);
  const githubPath = `${repoSubDir}/${fileName}`;

  let oldCode = "// New module code here";
  if (fs.existsSync(filePath)) {
    oldCode = fs.readFileSync(filePath, "utf-8");
  }

  return api.sendMessage(
    `📝 **EDITING TARGET:** ${repoSubDir}/${fileName}\n\n` +
    `👇 Naya code reply karein. (Naya code save hote hi ye message delete ho jayega)\n\n` +
    `\`\`\`javascript\n${oldCode}\n\`\`\``,
    threadID,
    (err, info) => {
      if (err) return;
      global.client = global.client || {};
      global.client.handleReply = global.client.handleReply || [];

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        commandName: fileNameOnly,
        filePath: filePath,
        githubPath: githubPath,
        isEventMode: isEventMode,
        targetType: targetType,
        repoSubDir: repoSubDir
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { body, threadID, messageID, senderID } = event;

  if (senderID != handleReply.author) return;

  try {
    const codeContent = (body || "").trim();

    // 1. Local disk par code save karein
    fs.writeFileSync(handleReply.filePath, codeContent, "utf-8");

    // 2. Active memory reload
    const isLoaded = registerModuleToBot(handleReply.filePath, handleReply.isEventMode);

    // 3. GitHub repository sync
    const sha = await getGithubFileSha(handleReply.githubPath);
    const ghSynced = await pushToGithub(
      handleReply.githubPath,
      codeContent,
      `Update ${handleReply.githubPath} via handleReply`,
      sha
    );

    // 4. Purana setup prompt message unsend karein
    if (handleReply.messageID) {
      api.unsendMessage(handleReply.messageID);
    }

    const replyMsg =
      `✦━━ ❪ ⚙️ ${handleReply.targetType.toUpperCase()} SAVED ❫ ━━✦\n\n` +
      `📁 Location: ${handleReply.repoSubDir}/${handleReply.commandName}.js\n` +
      `⚡ Active Load: ${isLoaded ? "SUCCESS ✅" : "SYNTAX ERR ⚠️"}\n` +
      `☁️ GitHub Sync: ${ghSynced ? "SUCCESS ✅" : "PENDING ⚠️"}\n\n` +
      `👑 **POWERED BY AHMAD RDX**`;

    return api.sendMessage(replyMsg, threadID, messageID);

  } catch (error) {
    return api.sendMessage(`❌ ERROR: ${error.message}`, threadID, messageID);
  }
};
