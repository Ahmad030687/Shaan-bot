/**
 * Module: Pair (Ultra-Premium Clean Canvas Matcher)
 * Path: models/commands/pair.js
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "pair",
  version: "8.0.0", 
  hasPermssion: 0,
  credits: "uzairrajput", // Strict core credit preserved
  description: "Ultra-premium clean single-card love pair module",
  commandCategory: "Love", 
  usages: "pair", 
  cooldowns: 5
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;

    try {
        let canvasModule;
        try {
            canvasModule = require("canvas");
        } catch (e) {
            return api.sendMessage("❌ Canvas module missing hai! Termux par 'npm install canvas' chalayein.", threadID, messageID);
        }

        const { createCanvas, loadImage } = canvasModule;
        const loadingMsg = await api.sendMessage("⏳ ❪ 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗 ❫ ✦ Generating VIP Love Card...", threadID);

        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        const listUserID = threadInfo.participantIDs.filter(id => id != botID && id != senderID);
        
        if (listUserID.length === 0) {
            return api.editMessage("❌ Group mein pairing ke liye aur members nahi hain!", loadingMsg.messageID, threadID);
        }

        const score = Math.floor(Math.random() * 101);
        const name1 = await Users.getNameUser(senderID);
        const partnerID = listUserID[Math.floor(Math.random() * listUserID.length)];
        const name2 = await Users.getNameUser(partnerID);

        // Fetch Avatars Parallel
        const [avatar1Res, avatar2Res] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${partnerID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
        ]);

        const avatar1 = await loadImage(Buffer.from(avatar1Res.data));
        const avatar2 = await loadImage(Buffer.from(avatar2Res.data));

        // Create Canvas (1200 x 500)
        const width = 1200;
        const height = 500;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // 1. Premium Cyber Dark Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#07020a");
        bgGrad.addColorStop(0.5, "#25061b");
        bgGrad.addColorStop(1, "#07020a");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Glowing Glass Border Frame
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        ctx.strokeStyle = "rgba(255, 42, 117, 0.6)";
        ctx.lineWidth = 4;
        ctx.fillRect(35, 35, width - 70, height - 70);
        ctx.strokeRect(35, 35, width - 70, height - 70);

        // 3. Circular Avatars with Neon Ring
        function drawAvatar(img, x, y, size) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, x, y, size, size);
            ctx.restore();

            // Ring Outer Border
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.lineWidth = 7;
            ctx.strokeStyle = "#ff2a75";
            ctx.stroke();
        }

        const avtSize = 220;
        drawAvatar(avatar1, 95, 110);
        drawAvatar(avatar2, width - 95 - avtSize, 110);

        // 4. Draw Pure Vector Heart in Center (No Missing Font Box Bug!)
        function drawVectorHeart(fromX, fromY, hWidth, hHeight) {
            ctx.save();
            ctx.beginPath();
            const topCurveHeight = hHeight * 0.3;
            ctx.moveTo(fromX, fromY + topCurveHeight);
            ctx.bezierCurveTo(fromX, fromY, fromX - hWidth / 2, fromY, fromX - hWidth / 2, fromY + topCurveHeight);
            ctx.bezierCurveTo(fromX - hWidth / 2, fromY + (hHeight + topCurveHeight) / 2, fromX, fromY + hHeight, fromX, fromY + hHeight);
            ctx.bezierCurveTo(fromX, fromY + hHeight, fromX + hWidth / 2, fromY + (hHeight + topCurveHeight) / 2, fromX + hWidth / 2, fromY + topCurveHeight);
            ctx.bezierCurveTo(fromX + hWidth / 2, fromY, fromX, fromY, fromX, fromY + topCurveHeight);
            ctx.closePath();
            ctx.fillStyle = "#ff2a75";
            ctx.fill();
            ctx.restore();
        }

        drawVectorHeart(width / 2, 125, 80, 75);

        // 5. Score Text (Clean Numbers Only)
        ctx.font = "bold 55px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(`${score}%`, width / 2, 270);

        // 6. User Names (Clean Font)
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#ffffff";
        const cleanName1 = name1.length > 13 ? name1.substring(0, 11) + ".." : name1;
        const cleanName2 = name2.length > 13 ? name2.substring(0, 11) + ".." : name2;
        ctx.fillText(cleanName1, 205, 385);
        ctx.fillText(cleanName2, width - 205, 385);

        // 7. Footer Branding (Pure ASCII Text)
        ctx.font = "bold 18px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText("POWERED BY AHMAD RDX", width / 2, 435);

        // Save & Send
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        const cardPath = path.join(cacheDir, `love_card_${senderID}.png`);
        fs.writeFileSync(cardPath, canvas.toBuffer());

        await api.unsendMessage(loadingMsg.messageID);

        let matchStatus = score > 80 ? "Perfect Match!" : score > 50 ? "Good Connection!" : "Needs Effort!";

        const msgBody = 
            `💖 𝐏𝐀𝐈𝐑 𝐌𝐀𝐓𝐂𝐇 💖\n\n` +
            `👤 ${name1} ✖️ ${name2}\n` +
            `📊 Compatibility: ${score}% — ${matchStatus}\n\n` +
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
        console.error("[PAIR ERROR]:", e);
        return api.sendMessage("❌ Pairing card generate karne mein error aaya!", threadID, messageID);
    }
};
