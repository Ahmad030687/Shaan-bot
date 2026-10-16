const fs = require("fs-extra");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "addevent",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "AHMAD RDX",
  description: "Reply se new event create karein",
  commandCategory: "System",
  usages: ".addevent event_name",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const name = String(args[0] || "").toLowerCase().replace(/\.js$/, "");

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    return api.sendMessage(
      "❌ Event name dein!\nExample: .addevent welcome",
      threadID,
      messageID
    );
  }

  const filePath = path.join(__dirname, `../events/${name}.js`);

  if (fs.existsSync(filePath)) {
    return api.sendMessage(
      `❌ Event "${name}" pehle se mojood hai!`,
      threadID,
      messageID
    );
  }

  global.client.handleReply = global.client.handleReply || [];

  return api.sendMessage(
    `╭━━━ ✦ ADD EVENT ✦ ━━━╮\n\n` +
    `📁 File: models/events/${name}.js\n` +
    `👇 Is message ka reply karke poora event code bhejein.\n` +
    `⚠️ Event mein module.exports.config aur module.exports.run zaroor hon.\n\n` +
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

    fs.ensureDirSync(path.dirname(handleReply.filePath));
    fs.writeFileSync(handleReply.filePath, code, "utf8");

    const resolved = require.resolve(handleReply.filePath);
    delete require.cache[resolved];

    const eventModule = require(handleReply.filePath);

    if (
      !eventModule.config ||
      !eventModule.config.name ||
      typeof eventModule.run !== "function"
    ) {
      fs.unlinkSync(handleReply.filePath);
      throw new Error("Event mein config.name ya run function missing hai!");
    }

    const eventName = eventModule.config.name;

    // Event Map mein load karein
    global.client.events.set(eventName, eventModule);

    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(
      `╭━━━ ✦ EVENT ADDED ✦ ━━━╮\n\n` +
      `✅ Name: ${eventName}\n` +
      `📁 File: ${handleReply.fileName}.js\n` +
      `⚡ Status: Loaded\n` +
      `👑 AHMAD RDX\n\n` +
      `╰━━━ ✦ SUCCESS ✦ ━━━╯`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error("[ADDEVENT ERROR]", err);

    return api.sendMessage(
      `❌ Event create nahi hui:\n${err.message}`,
      threadID,
      messageID
    );
  }
};
