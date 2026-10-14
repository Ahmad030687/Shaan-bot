/**
 * Module: Out All (Leave All Other Groups Command)
 * Path: Sardar/commands/outall.js
 * Credits: SHAAN KHAN  (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "outall",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "SHAAN KHAN ", // Strict core credit preserved
  description: "Bot leaves all groups except the current active thread with AHMAD RDX branding",
  commandCategory: "Admin",
  usages: "outall",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  // Authorized Owner UID List
  const permission = ["100002944872037"];

  if (!permission.includes(event.senderID)) {
    const accessDeniedMsg = 
      "╔════════════════════════╗\n" +
      "║ ⛔ ACCESS DENIED       ║\n" +
      "╚════════════════════════╝\n\n" +
      "❌ Boss, mujhe sirf mere Owner AHMAD RDX hi saare groups se leave karwa sakte hain!\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3";

    return api.sendMessage(accessDeniedMsg, event.threadID, event.messageID);
  }

  return api.getThreadList(100, null, ["INBOX"], (err, list) => {
    if (err) {
      console.error(err);
      return api.sendMessage(
        "╔════════════════════════╗\n" +
        "║ ⚠️ THREAD LIST ERROR   ║\n" +
        "╚════════════════════════╝\n\n" +
        "❌ Groups list fetch karne mein error aaya hai!",
        event.threadID,
        event.messageID
      );
    }

    let leftCount = 0;

    list.forEach(item => {
      if (item.isGroup == true && item.threadID != event.threadID) {
        api.remove
              
