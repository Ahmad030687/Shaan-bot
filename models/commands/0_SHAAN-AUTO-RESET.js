/**
 * Module: Auto Reset / System Auto Restart
 * Path: Sardar/commands/autoreset.js
 * Credits: SHAAN-BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
    name: "autoreset",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAAN-BABU", // Strict core credit preserved
    description: "Automatic hourly system restart manager with ultra-premium AHMAD RDX notifications",
    commandCategory: "system",
    cooldowns: 5
};

module.exports.handleEvent = async function({ api, event, Users, Threads }) {
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Karachi").format("HH:mm:ss");
    const minutes = moment.tz("Asia/Karachi").format("mm");
    const seconds = moment.tz("Asia/Karachi").format("ss");
    const adminIDs = global.config.ADMINBOT || [];    

    // Trigger exact hourly restart on minute 00 and second 00
    if (minutes === "00" && parseInt(seconds) < 5) {
        const restartMsg = 
            "╔════════════════════════╗\n" +
            "║  ⚙️ SYSTEM AUTO RESTART ⚙️ ║\n" +
            "╚════════════════════════╝\n\n" +
            `⏰ Current Time: ${timeNow}\n` +
            "🔄 Status: Initiating System Refresh & Restart...\n" +
            "⚡ Reason: Memory Cache Clearance & Stability\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "👑 SYSTEM OWNER: AHMAD RDX\n" +
            "📱 WhatsApp: +92306*******\n" +
            "✈️ Telegram: ahmadalisafdar3\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

        for (let adminID of adminIDs) {
            setTimeout(() => {
                api.sendMessage(restartMsg, adminID, () => process.exit(1));
            }, 1000);
        }
    }
};

module.exports.run = async ({ api, event }) => {
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Karachi").format("hh:mm:ss A");
    const dateNow = moment.tz("Asia/Karachi").format("DD/MM/YYYY");

    const msg = 
        "╔════════════════════════╗\n" +
        "║   🕒 SYSTEM TIME INFO 🕒  ║\n" +
        "╚════════════════════════╝\n\n" +
        `📅 Current Date: ${dateNow}\n` +
        `⏰ Current Time: ${timeNow}\n` +
        "⚡ Status: Auto Restart Active (Hourly)\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 POWERED BY: AHMAD RDX\n" +
        "📱 WhatsApp: +92306*******\n" +
        "✈️ Telegram: ahmadalisafdar3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    return api.sendMessage(msg, event.threadID, event.messageID);
};
