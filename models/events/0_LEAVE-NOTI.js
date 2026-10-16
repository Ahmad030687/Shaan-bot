module.exports.config = {
    name: "leave",
    eventType: ["log:unsubscribe"],
    version: "2.0.0",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Premium group leave notification",
    dependencies: {
        "fs-extra": "",
        "path: ""
    }
};

module.exports.onLoad = function () {
    global.nodemodule["fs-extra"].ensureDirSync(
        __dirname + "/cache/leaveGif/randomgif"
    );
};

module.exports.run = async function ({ api, event, Users, Threads }) {
    const { threadID, logMessageData, author } = event;
    const { join } = global.nodemodule["path"];
    const { createReadStream, existsSync, readdirSync } =
        global.nodemodule["fs-extra"];

    const leftID = logMessageData.leftParticipantFbId;
    if (leftID == api.getCurrentUserID()) return;

    try {
        const moment = require("moment-timezone");
        const now = moment.tz("Asia/Karachi");
        const time = now.format("DD/MM/YYYY | HH:mm:ss");
        const hour = now.hour();

        const data = global.data.threadData.get(parseInt(threadID)) ||
            (await Threads.getData(threadID)).data;

        const name = global.data.userName.get(leftID) ||
            await Users.getNameUser(leftID);

        const type = author == leftID ? "Left the group" : "Removed from group";
        const session = hour < 12 ? "Morning" :
            hour < 17 ? "Afternoon" :
            hour < 20 ? "Evening" : "Night";

        let msg = data.customLeave ||
`╭━━━ ✦ 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 ✦ ━━━╮
│  💔 {name}
│  {type}
│
│  🕒 {session} | {time}
│  👑 AHMAD RDX BOT
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        msg = msg
            .replace(/\{name\}/g, name)
            .replace(/\{type\}/g, type)
            .replace(/\{session\}/g, session)
            .replace(/\{time\}/g, time);

        const cache = join(__dirname, "cache", "leaveGif");
        const media = join(cache, `${threadID}.mp4`);
        const randomDir = join(cache, "randomgif");
        const files = existsSync(randomDir) ? readdirSync(randomDir) : [];

        const file = existsSync(media) ? media :
            files.length ? join(randomDir, files[Math.floor(Math.random() * files.length)]) : null;

        return api.sendMessage({
            body: msg,
            ...(file ? { attachment: createReadStream(file) } : {})
        }, threadID);

    } catch (err) {
        console.log("[LEAVE NOTI ERROR]", err);
    }
};
