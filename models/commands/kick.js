/**
 * Module: Kick Member
 * Path: Sardar/commands/kick.js
 * Credits: SHAAN KHAN (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
        name: "kick",
        version: "2.0.0", 
        hasPermssion: 1,
        credits: "SHAAN KHAN", // Strict core credit preserved
        description: "Removes mentioned members from the group with ultra-premium AHMAD RDX notifications",
        commandCategory: "KICK MEMBER", 
        usages: "@mention", 
        cooldowns: 2,
};

module.exports.languages = {
        "en": {
                "error": 
                        "╔════════════════════════╗\n" +
                        "║ ⚠️ KICK SYSTEM ERROR   ║\n" +
                        "╚════════════════════════╝\n\n" +
                        "❌ Sorry boss, removal process mein koi error aaya hai!\n\n" +
                        "👑 POWERED BY: AHMAD RDX",
                "needPermssion": 
                        "╔════════════════════════╗\n" +
                        "║ 🛡️ ADMIN PERMISSION    ║\n" +
                        "╚════════════════════════╝\n\n" +
                        "❌ Boss, bot is group mein admin nahi hai!\n" +
                        "👉 Pehle bot ko group admin banayein taake members ko remove kiya ja sakay.\n\n" +
                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                        "👑 POWERED BY: AHMAD RDX\n" +
                        "📱 WhatsApp: +92306*******\n" +
                        "✈️ Telegram: ahmadalisafdar3",
                "missingTag": 
                        "╔════════════════════════╗\n" +
                        "║ ⚠️ MISSING MENTION     ║\n" +
                        "╚════════════════════════╝\n\n" +
                        "📌 Boss, jisko group se nikalna hai usko mention (@tag) karein!\n" +
                        "💡 Example: /kick @user\n\n" +
                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                        "👑 POWERED BY: AHMAD RDX"
        }
};

module.exports.run = async function({ api, event, getText, Threads }) {
        var mention = Object.keys(event.mentions);
        try {
                let dataThread = (await Threads.getData(event.threadID)).threadInfo;
                if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) 
                        return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);
                
                if (!mention[0]) 
                        return api.sendMessage(getText("missingTag"), event.threadID, event.messageID);
                
                if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
                        const confirmMsg = 
                                "╔════════════════════════╗\n" +
                                "║  🚫 MEMBER KICK ACTIVE  ║\n" +
                                "╚════════════════════════╝\n\n" +
                                `⚡ Mentioned member(s) ko group se nikala ja raha hai...\n\n` +
                                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                                "👑 SYSTEM OWNER: AHMAD RDX\n" +
                                "📱 WhatsApp: +92306*******\n" +
                                "✈️ Telegram: ahmadalisafdar3\n" +
                                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

                        api.sendMessage(confirmMsg, event.threadID);

                        for (const o in mention) {
                                setTimeout(() => {
                                        api.removeUserFromGroup(mention[o], event.threadID);
                                }, 2500);
                        }
                } else {
                        return api.sendMessage(
                                "╔════════════════════════╗\n" +
                                "║ ⛔ ACCESS DENIED       ║\n" +
                                "╚════════════════════════╝\n\n" +
                                "❌ Boss, yeh command sirf Group Admin use kar sakte hain!\n\n" +
                                "👑 POWERED BY: AHMAD RDX", 
                                event.threadID, 
                                event.messageID
                        );
                }
        } catch { 
                return api.sendMessage(getText("error"), event.threadID, event.messageID); 
        }
};
