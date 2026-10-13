/**
 * Module: Join Notification & Bot Connect Module
 * Path: Sardar/commands/joinNoti.js
 * Credits: CatalizCS (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "2.0.0",
    credits: "CatalizCS", // Strict core credit preserved
    description: "Ultra-premium professional join notification & bot connect module by AHMAD RDX",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });        

    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
};

module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;

    // -------------------------------------------------------------
    // CASE 1: When Bot Joins a New Group
    // -------------------------------------------------------------
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`{ ${global.config.PREFIX} } × ${(!global.config.BOTNAME) ? "AHMAD-BOT" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        
        const welcomeText = 
            "Assalamu Alaikum Everyone 🥀🥀\n\n" +
            "⚡ ━━━━━━━━━━━━━━━━━━━━━━ ⚡\n" +
            "🌺 AHMAD RDX BOT CONNECTED 🌺\n" +
            "⚡ ━━━━━━━━━━━━━━━━━━━━━━ ⚡\n\n" +
            "👑 Bot Developed By: AHMAD RDX\n" +
            "🛡️ Status: Successfully Active & Approved!\n\n" +
            "📌 USE COMMANDS BELOW:\n" +
            `Type ${global.config.PREFIX}help to see all commands.\n\n` +
            "💡 Quick Examples:\n" +
            `• ${global.config.PREFIX}video7 (Video Songs)\n` +
            `• ${global.config.PREFIX}music (Audio Songs)\n` +
            `• ${global.config.PREFIX}help2 (Command List)\n` +
            `• ${global.config.PREFIX}info (Bot Information)\n\n` +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🌐 DEVELOPER & CONTACT INFO 🌐\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "👤 Owner: AHMAD RDX\n" +
            "📱 WhatsApp: +92306*******\n" +
            "✈️ Telegram: ahmadalisafdar3\n" +
            "🔗 Facebook: https://www.facebook.com/profile.php?id=100002944872037\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

        const videoPath = __dirname + "/cache/lv_7413647234832682256_20250105005634.mp4";
        const messagePayload = {
            body: welcomeText,
            ...(fs.existsSync(videoPath) ? { attachment: fs.createReadStream(videoPath) } : {})
        };

        return api.sendMessage(messagePayload, threadID);
    } 
    // -------------------------------------------------------------
    // CASE 2: When New Members Join the Group
    // -------------------------------------------------------------
    else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinGif");
            const pathGif = join(path, `${threadID}.gif`);

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            // Premium default welcome message layout
            let msg = typeof threadData.customJoin !== "undefined" ? threadData.customJoin : 
                "╔════════════════════════╗\n" +
                "║    ✨ 𝖂𝒠𝐋𝐂𝐎𝐌𝐄 𝕿𝓞 ✨    ║\n" +
                "╚════════════════════════╝\n\n" +
                "💖 HELLO DEAR MEMBER(S) 💖\n\n" +
                "┌────────────────────────┐\n" +
                "│ 👤 Member: {name}\n" +
                "│ 👥 Total Member No: {soThanhVien}\n" +
                "│ 🏠 Group: {threadName}\n" +
                "└────────────────────────┘\n\n" +
                "🥀 𝐇𝐀𝐏𝐏𝐘 𝐄𝐍𝐉𝐎𝐘 & 𝐌𝐀𝐉𝐄 𝐊𝐀𝐑𝐎 🥀\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "👑 POWERED BY: AHMAD RDX 👑\n" +
                "📱 Contact: +92306*******\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━";

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));
            let formPush = {};

            if (existsSync(pathGif)) {
                formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
            } else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
            } else {
                formPush = { body: msg, mentions };
            }

            return api.sendMessage(formPush, threadID);
        } catch (e) { 
            return console.log("[JOIN NOTI ERROR]:", e); 
        }
    }
};
