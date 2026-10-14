/**
 * Module: Pair (BGMI Light Action Matcher)
 * Path: models/commands/pair.js
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "pair",
  version: "9.0.0", 
  hasPermssion: 0,
  credits: "uzairrajput", // Strict core credit preserved
  description: "Light theme BGMI action love matcher card",
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
        const loadingMsg = await api.sendMessage("🎯 ❪ 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗 ❫ ✦ Locking Target & Generating BGMI Card...", threadID);

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

        // Fetch Avatars
        const [avatar1Res, avatar2Res] = await Promise.all([
            axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
            axios.get(`https://graph.facebook.com/${partnerID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
        ]);

        const avatar1 = await loadImage(Buffer.from(avatar1Res.data));
        const avatar2 = await loadImage(Buffer.from(avatar2Res.data));

        // Create Canvas (1200 x 520)
        const width = 1200;
        const height = 520;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // 1. Premium Light Metallic-White Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#ffffff");
        bgGrad.addColorStop(0.5, "#f0f3f8");
        bgGrad.addColorStop(1, "#e2e8f0");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid Cyber Lines (BGMI Tactical feel)
        ctx.strokeStyle = "rgba(15, 23, 42, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // 2. Tactical Glass Frame
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.strokeStyle = "#ff2a55";
        ctx.lineWidth = 4;
        ctx.fillRect(35, 35, width - 70, height - 70);
        ctx.strokeRect(35, 35, width - 70, height - 70);

        // 3. Draw Avatars (Shooter & Target)
        function drawCircularAvatar(img, x, y, size, borderColor) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, x, y, size, size);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
            ctx.lineWidth = 7;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        const avtSize = 210;
        // Left Avatar (Shooter)
        drawCircularAvatar(avatar1, 100, 115, avtSize, "#0f172a");
        // Right Avatar (Target)
        drawCircularAvatar(avatar2, width - 100 - avtSize, 115, avtSize, "#ff2a55");

        // 4. Center Crosshair / Scope Target Visual (Vector Art)
        const centerX = width / 2;
        const centerY = 180;

        // Outer Scope Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ff2a55";
        ctx.stroke();

        // Crosshair Lines
        ctx.beginPath(); ctx.moveTo(centerX - 70, centerY); ctx.lineTo(centerX + 70, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX, centerY - 70); ctx.lineTo(centerX, centerY + 70); ctx.stroke();

        // Center Red Lock Dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff2a55";
        ctx.fill();

        // 5. Score Percentage Box
        ctx.font = "bold 52px sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.textAlign = "center";
        ctx.fillText(`${score}%`, centerX, 305);

        // Status Badge
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#ff2a55";
        ctx.fillText("HEADSHOT COMPATIBILITY", centerX, 335);

        // 6. User Names
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#0f172a";

        const cleanName1 = name1.length > 13 ? name1.substring(0, 11) + ".." : name1;
        const cleanName2 = name2.length > 13 ? name2.substring(0, 11) + ".." : name2;

        ctx.fillText(`🔫 ${cleanName1}`, 205, 385);
        ctx.fillText(`🎯 ${cleanName2}`, width - 205, 385);

        // 7. Footer Branding
        ctx.font = "bold 18px sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText("BGMI EDITION • POWERED BY AHMAD RDX", centerX, 445);

        // Save & Send
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        const cardPath = path.join(cacheDir, `love_card_${senderID}.png`);
        fs.writeFileSync(cardPath, canvas.toBuffer());

        await api.unsendMessage(loadingMsg.messageID);

        let matchStatus = score > 80 ? "🎯 Direct Headshot!" : score > 50 ? "💥 Body Shot!" : "⚠️ Missed Shot!";

        const msgBody = 
            `🎯 𝐁𝐆𝐌𝐈 𝐏𝐀𝐈𝐑 𝐋𝐎𝐂𝐊 🎯\n\n` +
            `🔫 Shooter: ${name1}\n` +
            `🎯 Target: ${name2}\n` +
            `📊 Damage Score: ${score}% — ${matchStatus}\n\n` +
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
