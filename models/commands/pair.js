/**
 * Module: Pair (Single Card Canvas Matcher)
 * Path: models/commands/pair.js
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "pair",
  version: "5.0.0", 
  hasPermssion: 0,
  credits: "uzairrajput", // Strict core credit preserved
  description: "Ultra-premium single-card canvas love pairing with left-right avatars",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;

    try {
        // Step 1: Loading Banner
        const loadingMsg = await api.sendMessage("⏳ ❪ 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗 ❫ ✦ Generating Love Card...", threadID);

        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        const listUserID = threadInfo.participantIDs.filter(id => id !== botID && id !== senderID);
        
        if (listUserID.length === 0) {
            return api.editMessage("❌ Group mein pairing ke liye members nahi hain!", loadingMsg.messageID, threadID);
        }

        const score = Math.floor(Math.random() * 101);
        const name1 = await Users.getNameUser(senderID);
        const partnerID = listUserID[Math.floor(Math.random() * listUserID.length)];
        const name2 = await Users.getNameUser(partnerID);

        // Step 2: Fetch Avatars in Parallel
        const [avatar1Res, avatar2Res] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${partnerID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
        ]);

        const avatar1 = await loadImage(Buffer.from(avatar1Res.data));
        const avatar2 = await loadImage(Buffer.from(avatar2Res.data));

        // Step 3: Draw Canvas Card (1000 x 420)
        const width = 1000;
        const height = 420;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Romantic Dark Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#0a0206");
        bgGrad.addColorStop(0.5, "#1f0615");
        bgGrad.addColorStop(1, "#0a0206");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Glassmorphism Box Frame
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.strokeStyle = "rgba(255, 75, 120, 0.4)";
        ctx.lineWidth = 3;
        ctx.fillRect(30, 30, width - 60, height - 60);
        ctx.strokeRect(30, 30, width - 60, height - 60);

        // Function to draw circular avatar with neon glow
        function drawCircularAvatar(img, x, y, size, glowColor) {
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = glowColor;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, x, y, size, size);
            ctx.restore();

            // Outer Ring Border
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.lineWidth = 6;
            ctx.strokeStyle = glowColor;
            ctx.stroke();
        }

        // Draw Left Avatar (User)
        const avtSize = 200;
        drawCircularAvatar(avatar1, 90, 80, avtSize, "#ff3366");

        // Draw Right Avatar (Partner)
        drawCircularAvatar(avatar2, 710, 80, avtSize, "#ff3366");

        // Center Heart & Percentage Badge
        ctx.font = "bold 55px Sans";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(255, 51, 102, 0.8)";
        ctx.shadowBlur = 20;
        ctx.fillText("💖", width / 2, 160);

        ctx.font = "bold 42px Sans";
        ctx.fillStyle = "#ff3366";
        ctx.fillText(`${score}%`, width / 2, 225);
        ctx.shadowBlur = 0;

        // Names below avatars
        ctx.font = "bold 26px Sans";
        ctx.fillStyle = "#ffffff";
        
        // Left Name (Truncate if too long)
        const cleanName1 = name1.length > 12 ? name1.substring(0, 10) + ".." : name1;
        ctx.fillText(cleanName1, 190, 325);

        // Right Name
        const cleanName2 = name2.length > 12 ? name2.substring(0, 10) + ".." : name2;
        ctx.fillText(cleanName2, 810, 325);

        // Footer Branding
        ctx.font = "18px Sans";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText("✨ POWERED BY AHMAD RDX ✨", width / 2, 375);

        // Save Image
        const cacheDir = __dirname + "/cache";
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        const cardPath = `${cacheDir}/love_card_${senderID}.png`;
        fs.writeFileSync(cardPath, canvas.toBuffer());

        // Step 4: Remove loading and send single polished card
        await api.unsendMessage(loadingMsg.messageID);

        let heartStatus = score > 80 ? "💖 Perfect Match!" : score > 50 ? "💕 Good Connection!" : "💔 Needs Effort!";

        const msgBody = 
            `💖 𝐏𝐀𝐈𝐑 𝐌𝐀𝐓𝐂𝐇 💖\n` +
            `👤 ${name1} ✖️ ${name2}\n` +
            `📊 Match: ${score}% — ${heartStatus}\n\n` +
            `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

        return api.sendMessage(
            {
                body: msgBody,
                mentions: [{ id: senderID, tag: name1 }, { id: partnerID, tag: name2 }],
                attachment: fs.createReadStream(cardPath)
            },
            threadID,
            () => {
                if (fs.existsSync(cardPath)) fs.unlinkSync(cardPath);
            },
            messageID
        );

    } catch (e) {
        console.error("[PAIR CANVAS ERROR]:", e);
        return api.sendMessage("❌ Pairing card generate karne mein error aaya!", threadID, messageID);
    }
};
      
