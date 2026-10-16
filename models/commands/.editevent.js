const fs = require("fs-extra");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "editevent",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "AHMAD RDX",
  description: "Reply se event edit karein",
  commandCategory: "System",
  usages: ".editevent event_name",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const eventName = String(args[0] || "")
    .toLowerCase()
    .replace(/\.js$/, "")
    .trim();

  if (!eventName || !/^[a-z0-9_-]+$/i.test(eventName)) {
    return api.sendMessage(
      "❌ Event ka naam dein!\nExample: .editevent welcome",
      threadID,
      messageID
    );
  }

  const filePath = path.join(__dirname, "../events", `${eventName}.js`);

  if (!fs.existsSync(filePath)) {
    return api.sendMessage(
      `❌ Event "${eventName}" nahi mili!\n📁 models/events`,
      threadID,
      messageID
    );
  }

  const oldCode = fs.readFileSync(filePath, "utf8");

  global.client.handleReply = global.client.handleReply || [];

  return api.sendMessage(
    `╭━━━ ✦ EDIT EVENT ✦ ━━━╮\n\n` +
    `📁 File: ${eventName}.js\n` +
    `👇 Is message ka reply karke naya code bhejein.\n` +
    `⚠️ Naya code purani event file ko replace karega.\n\n` +
    `╰━━━ ✦ CURRENT CODE ✦ ━━━╯\n\n` +
    `\`\`\`javascript\n${oldCode}\n\`\`\``,
    threadID,
    (err, info) => {
      if (err || !info) return;

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: String(senderID),
        eventName,
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

  if (String(senderID) !== String(handleReply.author)) return;

  const code = String(body || "").trim();
  const tempPath = handleReply.filePath + ".tmp";

  try {
    if (!code) throw new Error("Code khali hai!");

    // Pehle syntax check
    new vm.Script(code, {
      filename: handleReply.eventName + ".js"
    });

    // Temporary file se module check
    fs.writeFileSync(tempPath, code, "utf8");

    const tempResolved = require.resolve(tempPath);
    delete require.cache[tempResolved];

    const newEvent = require(tempResolved);

    if (
      !newEvent.config ||
      !newEvent.config.name ||
      typeof newEvent.run !== "function"
    ) {
      throw new Error(
        "Event mein config.name ya run function missing hai!"
      );
    }

    // Purani event file ko replace karein
    fs.writeFileSync(handleReply.filePath, code, "utf8");

    // Naya event module load karein
    const realPath = require.resolve(handleReply.filePath);
    delete require.cache[realPath];

    const loadedEvent = require(realPath);

    // Event Map mein update
    global.client.events.delete(handleReply.eventName);
    global.client.events.set(
      loadedEvent.config.name,
      loadedEvent
    );

    // Temporary file delete
    fs.unlinkSync(tempPath);

    // Prompt unsend
    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(
      `╭━━━ ✦ EVENT UPDATED ✦ ━━━╮\n\n` +
      `✅ Event: ${loadedEvent.config.name}\n` +
      `📁 File: ${handleReply.eventName}.js\n` +
      `⚡ Status: Saved & Reloaded\n` +
      `👑 AHMAD RDX\n\n` +
      `╰━━━ ✦ SUCCESS ✦ ━━━╯`,
      threadID,
      messageID
    );

  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    console.error("[EDITEVENT ERROR]", error);

    return api.sendMessage(
      `❌ Event update nahi hui:\n\n${error.message}\n\nPurani event file ko replace nahi kiya gaya.`,
      threadID,
      messageID
    );
  }
};
