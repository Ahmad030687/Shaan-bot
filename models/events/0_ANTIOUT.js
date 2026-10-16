module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "ARIF BABU",
    description: "Premium AntiOut protection"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
    const { threadID, author, logMessageData } = event;
    const leftID = logMessageData.leftParticipantFbId;

    if (leftID == api.getCurrentUserID()) return;

    const data = (await Threads.getData(threadID)).data || {};
    if (data.antiout === false) return;

    // Only re-add members who leave themselves
    if (author != leftID) return;

    const name = global.data.userName.get(leftID) ||
        await Users.getNameUser(leftID);

    api.addUserToGroup(leftID, threadID, (err) => {
        const msg = err
            ? `╭━━ ✦ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ✦ ━━╮
│ ❌ ${name} ko wapas add nahi kar saka.
╰━━━━━━━━━━━━━━━━━━╯`
            : `╭━━ ✦ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ✦ ━━╮
│ 🔒 ${name} wapas group mein add!
│ 👑 AHMAD RDX BOT
╰━━━━━━━━━━━━━━━━━━╯`;

        return api.sendMessage(msg, threadID);
    });
};
