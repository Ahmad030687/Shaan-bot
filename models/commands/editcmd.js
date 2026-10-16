
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "editcmd",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "AHMAD RDX",
  description: "Edit existing command by replying with new code",
  commandCategory: "system",
  usages: "editcmd <command name>",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const name = String(args[0] || "")
    .trim()
    .toLowerCase()
    .replace(/\.js$/i, "");

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    return api.sendMessage(
      "Usage: .editcmd <command name>\nExample: .editcmd pair",
      threadID,
      messageID
    );
  }

  const filePath = path.join(__dirname, `${name}.js`);

  if (!(await fs.pathExists(filePath))) {
    return api.sendMessage(
      `❌ Command file nahi mili: ${name}.js`,
      threadID,
      messageID
    );
  }

  return api.sendMessage(
    `📝 EDIT COMMAND: ${name}.js\n\n` +
    `Ab is message par REPLY karke naya complete JavaScript code paste karo.\n\n` +
    `⚠️ Purana code replace ho jayega.`,
    threadID,
    (error, info) => {
      if (error || !info) return;

      global.client.editcmdPending =
        global.client.editcmdPending || new Map();

      global.client.editcmdPending.set(String(info.messageID), {
        name,
        senderID: String(senderID),
        threadID: String(threadID)
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const pending = global.client.editcmdPending;
  if (!pending) return;

  const promptID = String(handleReply.messageID);
  const request = pending.get(promptID);

  if (!request) return;

  if (String(event.senderID) !== request.senderID) {
    return api.sendMessage(
      "❌ Ye edit prompt kisi aur user ne start kiya tha.",
      event.threadID,
      event.messageID
    );
  }

  const code = String(event.body || "").trim();

  if (!code || code.toLowerCase() === "cancel") {
    pending.delete(promptID);
    return api.sendMessage("❎ Edit cancel ho gaya.", event.threadID);
  }

  const filePath = path.join(__dirname, `${request.name}.js`);
  const tempPath = `${filePath}.tmp`;

  try {
    // JavaScript syntax check
    new Function(code);

    // Temporary file mein save
    await fs.writeFile(tempPath, code, "utf8");

    // Backup existing command
    const backupPath = `${filePath}.backup`;
    await fs.copy(filePath, backupPath);

    try {
      await fs.move(tempPath, filePath, { overwrite: true });

      // Reload command
      const resolved = require.resolve(filePath);
      delete require.cache[resolved];

      const command = require(resolved);

      if (!command.config || !command.config.name ||
          typeof command.run !== "function") {
        throw new Error("Invalid command structure");
      }

      global.client.commands.set(
        command.config.name.toLowerCase(),
        command
      );

      await fs.remove(backupPath);
      pending.delete(promptID);

      return api.sendMessage(
        `✅ COMMAND UPDATED!\n\n` +
        `📁 File: ${request.name}.js\n` +
        `⚡ Runtime: Reloaded\n` +
        `👑 AHMAD RDX`,
        event.threadID,
        event.messageID
      );
    } catch (error) {
      // Error par old code restore
      await fs.move(backupPath, filePath, { overwrite: true });
      delete require.cache[require.resolve(filePath)];
      pending.delete(promptID);

      return api.sendMessage(
        `❌ Code load nahi hua.\nPurana code restore kar diya.\n\n${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  } catch (error) {
    return api.sendMessage(
      `❌ JavaScript syntax error:\n${error.message}`,
      event.threadID,
      event.messageID
    );
  }
};
