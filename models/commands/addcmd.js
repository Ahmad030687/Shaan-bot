const fs = require("fs-extra");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "addcmd",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "AHMAD RDX",
  description: "Reply se new command create karein",
  commandCategory: "System",
  usages: ".addcmd command_name",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const name = String(args[0] || "").toLowerCase().replace(/\.js$/, "");

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    return api.sendMessage(
      "❌ Command name dein!\nExample: .addcmd hello",
      threadID,
      messageID
    );
  }

  const filePath = path.join(__dirname, `${name}.js`);

  if (fs.existsSync(filePath)) {
    return api.sendMessage(
      `❌ Command "${name}" pehle se mojood hai!`,
      threadID,
      messageID
    );
  }

  global.client.handleReply = global.client.handleReply || [];

  return api.sendMessage(
    `╭━━━ ✦ ADD COMMAND ✦ ━━━╮\n\n` +
    `📁 File: ${name}.js\n` +
    `👇 Is message ka reply karke poora command code bhejein.\n` +
    `⚠️ Code mein module.exports.config aur module.exports.run zaroor hon.\n\n` +
    `╰━━━ ✦ AHMAD RDX ✦ ━━━╯`,
    threadID,
    (err, info) => {
      if (err || !info) return;

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: String(senderID),
        fileName: name,
        filePath
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { body, threadID, messageID, senderID } = event;

  if (String(senderID) !== String(handleReply.author)) return;

  const code = String(body || "").trim();

  try {
    if (!code) throw new Error("Code khali hai!");

    // JavaScript syntax check
    new vm.Script(code, { filename: handleReply.fileName + ".js" });

    // Command config check
    const tempModule = { exports: {} };
    const tempRequire = require;

    // File save
    fs.writeFileSync(handleReply.filePath, code, "utf8");

    const resolved = require.resolve(handleReply.filePath);
    delete require.cache[resolved];

    const command = require(handleReply.filePath);

    if (
      !command.config ||
      !command.config.name ||
      typeof command.run !== "function"
    ) {
      fs.unlinkSync(handleReply.filePath);
      throw new Error("Command mein config.name ya run function missing hai!");
    }

    const commandName = command.config.name.toLowerCase();

    global.client.commands.set(commandName, command);

    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(
      `╭━━━ ✦ COMMAND ADDED ✦ ━━━╮\n\n` +
      `✅ Name: ${commandName}\n` +
      `📁 File: ${handleReply.fileName}.js\n` +
      `⚡ Status: Loaded\n` +
      `👑 AHMAD RDX\n\n` +
      `╰━━━ ✦ SUCCESS ✦ ━━━╯`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error("[ADDCMD ERROR]", err);

    return api.sendMessage(
      `❌ Command create nahi hui:\n${err.message}`,
      threadID,
      messageID
    );
  }
};
