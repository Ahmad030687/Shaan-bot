const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "editcmd",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "AHMAD RDX",
  description: "Reply se command edit aur reload karein",
  commandCategory: "System",
  usages: ".editcmd command_name",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const commandName = String(args[0] || "")
    .toLowerCase()
    .replace(/\.js$/, "")
    .trim();

  if (!commandName) {
    return api.sendMessage(
      "❌ Command ka naam dein!\n\nExample: .editcmd rankup",
      threadID,
      messageID
    );
  }

  // Sirf safe filename allow karein
  if (!/^[a-z0-9_-]+$/i.test(commandName)) {
    return api.sendMessage(
      "❌ Invalid command name!",
      threadID,
      messageID
    );
  }

  const filePath = path.join(__dirname, `${commandName}.js`);

  if (!fs.existsSync(filePath)) {
    return api.sendMessage(
      `❌ Command "${commandName}" nahi mili!\n\n📁 Folder: models/commands`,
      threadID,
      messageID
    );
  }

  const oldCode = fs.readFileSync(filePath, "utf8");

  // Reply handler array ensure karein
  global.client.handleReply =
    global.client.handleReply || [];

  return api.sendMessage(
    `╭━━━ ✦ EDIT COMMAND ✦ ━━━╮\n\n` +
    `📁 File: ${commandName}.js\n` +
    `👤 Editor: AHMAD RDX\n\n` +
    `👇 Is message ka reply karke naya code bhejein.\n` +
    `⚠️ Reply ka code file ko replace karega.\n` +
    `🗑️ Save hone par ye prompt delete ho jayega.\n\n` +
    `╰━━━ ✦ CURRENT CODE ✦ ━━━╯\n\n` +
    `\`\`\`javascript\n${oldCode}\n\`\`\``,
    threadID,
    (err, info) => {
      if (err || !info) {
        return api.sendMessage(
          "❌ Edit prompt send nahi ho saka!",
          threadID
        );
      }

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: String(senderID),
        commandName,
        filePath
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({
  api,
  event,
  handleReply
}) {
  const { body, threadID, messageID, senderID } = event;

  // Sirf command chalane wala user reply kar sakta hai
  if (String(senderID) !== String(handleReply.author)) return;

  const newCode = String(body || "").trim();

  if (!newCode) {
    return api.sendMessage(
      "❌ Reply mein JavaScript code bhejein!",
      threadID,
      messageID
    );
  }

  try {
    // Pehle code ko temporary file mein check karein
    const tempPath = handleReply.filePath + ".tmp";

    fs.writeFileSync(tempPath, newCode, "utf8");

    // Syntax check
    try {
      delete require.cache[require.resolve(tempPath)];
      require(tempPath);
    } catch (syntaxError) {
      fs.unlinkSync(tempPath);

      return api.sendMessage(
        `❌ Code mein error hai:\n\n${syntaxError.message}\n\n` +
        `Purani command file safe hai. Sahi code reply karein.`,
        threadID,
        messageID
      );
    }

    // Temporary file remove
    delete require.cache[require.resolve(tempPath)];
    fs.unlinkSync(tempPath);

    // Naya code save
    fs.writeFileSync(handleReply.filePath, newCode, "utf8");

    // Command reload
    const realPath = require.resolve(handleReply.filePath);
    delete require.cache[realPath];

    const newCommand = require(realPath);

    if (!newCommand.config || !newCommand.config.name) {
      throw new Error("Command config.name missing hai!");
    }

    const commands = global.client.commands;
    const oldName = handleReply.commandName.toLowerCase();
    const newName = newCommand.config.name.toLowerCase();

    // Purana command remove karke naya load
    commands.delete(oldName);
    commands.set(newName, newCommand);

    // Purane prompt ko delete karein
    if (handleReply.messageID) {
      api.unsendMessage(handleReply.messageID);
    }

    return api.sendMessage(
      `╭━━━ ✦ COMMAND UPDATED ✦ ━━━╮\n\n` +
      `✅ Command: ${newName}\n` +
      `📁 File: ${handleReply.commandName}.js\n` +
      `⚡ Reload: SUCCESS\n` +
      `👑 By: AHMAD RDX\n\n` +
      `╰━━━ ✦ DONE ✦ ━━━╯`,
      threadID,
      messageID
    );

  } catch (error) {
    console.error("[EDITCMD ERROR]", error);

    return api.sendMessage(
      `❌ Command update error:\n${error.message}`,
      threadID,
      messageID
    );
  }
};
