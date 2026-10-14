/**
 * Module: Off Bot (System Shutdown Command)
 * Path: Sardar/commands/offbot.js
 * Credits: 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "offbot",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", // Strict core credit preserved
  description: "Turns off the bot system safely with ultra-premium AHMAD RDX notification",
  commandCategory: "system",
  cooldowns: 0
};

module.exports.run = ({ event, api }) => {
  const permission = ["100002944872037"];

  if (!permission.includes(event.senderID)) {
    const accessDeniedMsg = 
      "╔════════════════════════╗\n" +
      "║ ⛔ ACCESS DENIED       ║\n" +
      "╚════════════════════════╝\n\n" +
      "❌ Boss, yeh command sirf Owner AHMAD RDX ko hi allow hai!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3";

    return api.sendMessage(accessDeniedMsg, event.threadID, event.messageID);
  }

  const shutdownMsg = 
    "╔════════════════════════╗\n" +
    "║  🔴 SYSTEM SHUTDOWN    ║\n" +
    "╚════════════════════════╝\n\n" +
    `⚡ ${global.config.BOTNAME || "AHMAD RDX"} Bot is turning OFF now...\n` +
    "🔌 Stopping PM2 process & terminating connections.\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "👑 SYSTEM OWNER: AHMAD RDX\n" +
    "📱 WhatsApp: +92306*******\n" +
    "✈️ Telegram: ahmadalisafdar3\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  return api.sendMessage(shutdownMsg, event.threadID, () => process.exit(0), event.messageID);
};
