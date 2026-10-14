/**
 * Module: Pair (Love Compatibility)
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "pair",
  version: "2.0.0", 
  hasPermssion: 0,
  credits: "uzairrajput", // Strict core credit preserved
  description: "Ultra-premium attractive love pairing module by AHMAD RDX",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 10
};

module.exports.run = async function({ api, event, Threads, Users }) {
    try {
        const axios = global.nodemodule["axios"];
        const fs = global.nodemodule["fs-extra"];

        // Fetch thread participants safely
        const threadInfo = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();
        const listUserID = threadInfo.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        
        if (listUserID.length === 0) {
            return api.sendMessage("⚠️ Group mein aur members nahi hain pairing ke liye!", event.threadID, event.messageID);
        }

        var tle = Math.floor(Math.random() * 101);
        var namee = await Users.getNameUser(event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
        var name = await Users.getNameUser(id);
        
        var arraytag = [];
        arraytag.push({ id: event.senderID, tag: namee });
        arraytag.push({ id: id, tag: name });

        // Gif collection for pairing
        const gifCute = [
            "https://i.ibb.co/0Rw4BTTP/Messenger-creation-1-C7-BD1-AA-3-CFC-4-FF4-8582-82-FE1052591-D.gif",
            "https://i.ibb.co/2016p7X1/Messenger-creation-42-FE17-AC-F16-F-4-DFD-A4-F7-83-CE974936-A3.gif",
            "https://i.ibb.co/Rpd1YWsP/Messenger-creation-A3-FBA4-E1-5589-47-FB-845-B-7-EDC8-DFD23-D1.gif",
            "https://i.ibb.co/GQWVrDkc/Messenger-creation-6-F5-D2524-4-A2-E-4823-8-E9-B-EC46979-A7-FBB.gif",
            "https://i.ibb.co/yFWqJ0Kj/Messenger-creation-498-C3-F99-B27-C-4-D5-D-B656-33-B4-B0-E7-D901.gif",
            "https://i.ibb.co/DPXGtCw8/Messenger-creation-30-BBF4-B3-F16-A-4972-B8-B0-12919-C882-E45.gif"
        ];

        // Download Avatars and Gif
        let Avatar = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data; 
        fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));

        let gifLove = (await axios.get(gifCute[Math.floor(Math.random() * gifCute.length)], { responseType: "arraybuffer" })).data; 
        fs.writeFileSync(__dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8"));

        let Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

        var imglove = [
            fs.createReadStream(__dirname + "/cache/avt.png"),
            fs.createReadStream(__dirname + "/cache/giflove.png"),
            fs.createReadStream(__dirname + "/cache/avt2.png")
        ];

        var msg = {
            body: 
                "╔════════════════════════╗\n" +
                "║   💖 LOVE PAIRING RESULT 💖   ║\n" +
                "╚════════════════════════╝\n\n" +
                "✨ ━━━━━━━━━━━━━━━━━━━━━━ ✨\n" +
                `👤 Partner 1: ${namee}\n` +
                `👤 Partner 2: ${name}\n` +
                `💞 Compatibility Ratio: ${tle}%\n` +
                "✨ ━━━━━━━━━━━━━━━━━━━━━━ ✨\n\n" +
                "💬 Mubarak ho! Aapki jodi match ho chuki hai. Maze karo aur khush raho! 🥰\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "👑 POWERED BY: AHMAD RDX\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            mentions: arraytag,
            attachment: imglove
        };

        return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
        console.error(e);
        return api.sendMessage("❌ Error aa gaya pairing karne mein!", event.threadID, event.messageID);
    }
};
