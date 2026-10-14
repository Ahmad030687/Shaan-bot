/**
 * Module: Restart (System Reboot Command)
 * Path: Sardar/commands/restart.js
 * Credits: mirai (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "restart",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "mirai", // Strict core credit preserved
  description: "Restarts the bot system safely with ultra-premium AHMAD RDX countdown",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const initialMsg = 
    "╔════════════════════════╗\n" +
    "║  ⚙️ SYSTEM RESTART INIT ⚙️ ║\n" +
    "╚════════════════════════╝\n\n" +
    "⚡ Initializing System Reboot Sequence...\n" +
    "⏳ Please wait while AHMAD RDX Bot refreshes.\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "👑 SYSTEM OWNER: AHMAD RDX\n" +
    "📱 WhatsApp: +92306*******\n" +
    "✈️ Telegram: ahmadalisafdar3\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  api.sendMessage(initialMsg, threadID, messageID);

  setTimeout(() => { 
    api.sendMessage("⌛ Rebooting in: 3 Seconds...", threadID); 
  }, 3000);

  setTimeout(() => { 
    api.sendMessage("⌛ Rebooting in: 2 Seconds...", threadID); 
  }, 6000);

  setTimeout(() => { 
    api.sendMessage("⌛ Rebooting in: 1 Second...", threadID); 
  }, 9000);

  setTimeout(() => { 
    const finalMsg = 
      "╔════════════════════════╗\n" +
      "║ 🔄 REBOOTING NOW...    ║\n" +
      "╚════════════════════════╝\n\n" +
      "⚡ Clearing memory cache and restarting PM2 process.\n" +
      "🔌 Bot will be back online in a few seconds!";

    api.sendMessage(finalMsg, threadID, () => process.exit(1));
  }, 12000);
};
