/**
 * Join Notification Module
 * Credits: CatalizCS | Premium Upgrade: AHMAD RDX
 */

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "2.0.0",
    credits: "CatalizCS",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { ensureDirSync } = global.nodemodule["fs-extra"];
    ensureDirSync(__dirname + "/cache/joinGif/randomgif");
};

module.exports.run = async function ({ api, event }) {
    const { threadID, logMessageData } = event;
    const { join } = global.nodemodule["path"];
    const { createReadStream, existsSync, readdirSync } =
        global.nodemodule["fs-extra"];

    const members = logMessageData.addedParticipants || [];
    const botID = api.getCurrentUserID();
    const prefix = global.config.PREFIX;
    const ownerID = "100002944872037";

    // Bot Group Connect
    if (members.some(m => m.userFbId == botID)) {
        api.changeNickname(
            `${prefix} × ${global.config.BOTNAME || "AHMAD-BOT"}`,
            threadID,
            botID
        );

        return api.sendMessage(
            `╭━━━ ✦ 𝗔𝗛𝗠𝗔𝗗 𝗕𝗢𝗧 ✦ ━━━╮
│  ✨ Bot Successfully Connected!
│  👑 Owner: AHMAD RDX
│  ⚡ Type ${prefix}help for commands
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
            threadID
        );
    }

    // New Member Welcome
    try {
        const info = await api.getThreadInfo(threadID);
        const names = members.map(m => m.fullName);
        const mentions = members.map(m => ({
            tag: m.fullName,
            id: m.userFbId
        }));

        const total = info.participantIDs.length;
        const data = global.data.threadData.get(parseInt(threadID)) || {};

        let msg = data.customJoin ||
`╭━━━ ✦ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✦ ━━━╮
│  💖 Welcome {name}
│  🏠 {threadName}
│  👥 Member #{soThanhVien}
│
│  ✨ Enjoy your stay!
│  👑 AHMAD RDX BOT
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        msg = msg
            .replace(/\{name\}/g, names.join(", "))
            .replace(/\{threadName\}/g, info.threadName)
            .replace(/\{soThanhVien\}/g, total)
            .replace(/\{type\}/g, members.length > 1 ? "Friends" : "Friend");

        const cache = join(__dirname, "cache", "joinGif");
        const gif = join(cache, `${threadID}.gif`);
        const randomDir = join(cache, "randomgif");
        const gifs = existsSync(randomDir) ? readdirSync(randomDir) : [];

        const media = existsSync(gif)
            ? gif
            : gifs.length
                ? join(randomDir, gifs[Math.floor(Math.random() * gifs.length)])
                : null;

        return api.sendMessage({
            body: msg,
            mentions,
            ...(media ? { attachment: createReadStream(media) } : {})
        }, threadID);

    } catch (err) {
        console.log("[JOIN NOTI]", err);
    }
};
