/**
 * Module: Pair (Animated Dynamic Loader & Compact Matcher)
 * Path: models/commands/pair.js
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "pair",
  version: "4.0.0", 
  hasPermssion: 0,
  credits: "uzairrajput", // Strict core credit preserved
  description: "Ultra-compact animated love pairing module with smooth live edit effect",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];

    try {
        // Step 1: Instant Stylish Loading Banner Send Karein
        const loadingMsg = await api.sendMessage("⏳ ❪ 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗 ❫ ✦ 𝐹𝑖𝑛𝑑𝑖𝑛𝑔 𝑃𝑒𝑟𝑓𝑒𝑐𝑡 𝑀𝑎𝑡𝑐ℎ...", threadID);

        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        const listUserID = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);
        
        if (listUserID.length === 0) {
            return api.editMessage("❌ 𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑖𝑛 𝑝𝑎𝑖𝑟𝑖𝑛𝑔 𝑘𝑒 𝑙𝑖𝑦𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑛𝑎ℎ𝑖 ℎ𝑎𝑖𝑛!", loadingMsg.messageID, threadID);
        }

        const score = Math.floor(Math.random() * 101);
        const name1 = await Users.getNameUser(senderID);
        const partnerID = listUserID[Math.floor(Math.random() * listUserID.length)];
        const name2 = await Users.getNameUser(partnerID);

        const gifLinks = [
            "https://i.ibb.co/0Rw4BTTP/Messenger-creation-1-C7-BD1-AA-3-CFC-4-FF4-8582-82-FE1052591-D.gif",
            "https://i.ibb.co/2016p7X1/Messenger-creation-42-FE17-AC-F16-F-4-DFD-A4-F7-83-CE974936-A3.gif",
            "https://i.ibb.co/Rpd1YWsP/Messenger-creation-A3-FBA4-E1-5589-47-FB-845-B-7-EDC8-DFD23-D1.gif"
        ];

        const cacheDir = __dirname + "/cache";
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

        const p1 = `${cacheDir}/p1_${senderID}.png`;
        const p2 = `${cacheDir}/p2_${partnerID}.png`;
        const g1 = `${cacheDir}/g1_${Date.now()}.gif`;

        // Parallel High-Speed Download
        const [r1, r2, rg] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${partnerID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(gifLinks[Math.floor(Math.random() * gifLinks.length)], { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(p1, Buffer.from(r1.data));
        fs.writeFileSync(p2, Buffer.from(r2.data));
        fs.writeFileSync(g1, Buffer.from(rg.data));

        // Status Symbol according to score
        let heartStatus = score > 80 ? "💖" : score > 50 ? "💕" : "💔";

        // Step 2: Compact, Ultra-Clean & Professional Final Card Text
        const finalMsg = 
            `✦━━━ ❪ 💖 𝐏𝐀𝐈𝐑 𝐌𝐀𝐓𝐂𝐇 💖 ❫ ━━━✦\n` +
            `👤 ${name1} ✖️ ${name2}\n` +
            `📊 𝐶𝑜𝑚𝑝𝑎𝑡𝑖𝑏𝑖𝑙𝑖𝑡𝑦: ${score}% ${heartStatus}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

        // Pehle temp message delete karein aur photo attachment ke sath final msg send karein
        await api.unsendMessage(loadingMsg.messageID);

        return api.sendMessage(
            {
                body: finalMsg,
                mentions: [{ id: senderID, tag: name1 }, { id: partnerID, tag: name2 }],
                attachment: [fs.createReadStream(p1), fs.createReadStream(g1), fs.createReadStream(p2)]
            },
            threadID,
            () => {
                if (fs.existsSync(p1)) fs.unlinkSync(p1);
                if (fs.existsSync(p2)) fs.unlinkSync(p2);
                if (fs.existsSync(g1)) fs.unlinkSync(g1);
            },
            messageID
        );

    } catch (e) {
        console.error("[PAIR EDIT ERROR]:", e);
        return api.sendMessage("❌ 𝑃𝑎𝑖𝑟𝑖𝑛𝑔 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑚𝑒𝑖𝑛 𝑒𝑟𝑟𝑜𝑟 𝑎𝑎 𝑔𝑎𝑦𝑎!", threadID, messageID);
    }
};
