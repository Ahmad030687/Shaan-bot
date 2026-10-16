/**
 * Module: Pair (BGMI Premium Tactical Love Matcher)
 * Path: models/commands/pair.js
 * Credits: uzairrajput (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "pair",
    version: "10.0.0",
    hasPermssion: 0,
    credits: "uzairrajput",
    description: "Premium BGMI PUBG pair compatibility card",
    commandCategory: "Love",
    usages: "pair",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID, messageID, senderID } = event;

    let loadingMsg;
    let cardPath;

    try {
        let canvasModule;

        try {
            canvasModule = require("canvas");
        } catch (e) {
            return api.sendMessage(
                "❌ Canvas missing! Install it using npm install canvas",
                threadID,
                messageID
            );
        }

        const { createCanvas, loadImage } = canvasModule;

        loadingMsg = await api.sendMessage(
            "🎯 AHMAD RDX | Locking Target & Creating Premium Pair Card...",
            threadID
        );

        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();

        const listUserID = threadInfo.participantIDs.filter(
            id => id != botID && id != senderID
        );

        if (listUserID.length === 0) {
            return api.editMessage(
                "❌ Group mein pairing ke liye aur members nahi hain!",
                loadingMsg.messageID,
                threadID
            );
        }

        // Pair data
        const score = Math.floor(Math.random() * 101);

        const name1 = await Users.getNameUser(senderID);
        const partnerID =
            listUserID[Math.floor(Math.random() * listUserID.length)];
        const name2 = await Users.getNameUser(partnerID);

        // --------------------------------------------------
        // FETCH PROFILE PICTURES
        // --------------------------------------------------

        const avatarURL = id =>
            `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const [avatar1Res, avatar2Res] = await Promise.all([
            axios.get(avatarURL(senderID), {
                responseType: "arraybuffer",
                timeout: 15000
            }),
            axios.get(avatarURL(partnerID), {
                responseType: "arraybuffer",
                timeout: 15000
            })
        ]);

        const avatar1 = await loadImage(Buffer.from(avatar1Res.data));
        const avatar2 = await loadImage(Buffer.from(avatar2Res.data));

        // --------------------------------------------------
        // CANVAS
        // --------------------------------------------------

        const width = 1600;
        const height = 1000;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        const blue = "#159CFF";
        const pink = "#FF286B";
        const dark = "#101827";
        const white = "#FFFFFF";

        // --------------------------------------------------
        // 1. PREMIUM WHITE BATTLEFIELD BACKGROUND
        // --------------------------------------------------

        const bg = ctx.createLinearGradient(0, 0, width, height);

        bg.addColorStop(0, "#FFFFFF");
        bg.addColorStop(0.45, "#EDF3FA");
        bg.addColorStop(1, "#DCE5F0");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Soft radial light
        const light = ctx.createRadialGradient(
            width / 2, 400, 50,
            width / 2, 400, 750
        );

        light.addColorStop(0, "rgba(255,255,255,0.95)");
        light.addColorStop(1, "rgba(180,200,225,0.10)");

        ctx.fillStyle = light;
        ctx.fillRect(0, 0, width, height);

        // --------------------------------------------------
        // 2. TACTICAL GRID
        // --------------------------------------------------

        ctx.strokeStyle = "rgba(15,23,42,0.045)";
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // --------------------------------------------------
        // 3. UTILITIES
        // --------------------------------------------------

        function roundedRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }

        function drawText(text, x, y, size, color, align = "center") {
            ctx.font = `bold ${size}px sans-serif`;
            ctx.fillStyle = color;
            ctx.textAlign = align;
            ctx.textBaseline = "middle";
            ctx.fillText(text, x, y);
        }

        function fitText(text, maxWidth, startSize, font = "sans-serif") {
            let size = startSize;

            while (size > 18) {
                ctx.font = `bold ${size}px ${font}`;

                if (ctx.measureText(text).width <= maxWidth) {
                    break;
                }

                size -= 2;
            }

            return size;
        }

        function drawGlowCircle(x, y, radius, color, blur = 25) {
            ctx.save();

            ctx.shadowColor = color;
            ctx.shadowBlur = blur;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();
        }

        // --------------------------------------------------
        // 4. OUTER PREMIUM FRAME
        // --------------------------------------------------

        ctx.save();

        ctx.shadowColor = "rgba(15,23,42,0.15)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 10;

        roundedRect(35, 35, width - 70, height - 70, 35);

        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.fill();

        ctx.restore();

        roundedRect(35, 35, width - 70, height - 70, 35);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(100,116,139,0.45)";
        ctx.stroke();

        // --------------------------------------------------
        // 5. MILITARY DECORATIONS
        // --------------------------------------------------

        function drawSmoke(x, y, radius, color) {
            ctx.save();

            const smoke = ctx.createRadialGradient(
                x, y, 1,
                x, y, radius
            );

            smoke.addColorStop(0, color);
            smoke.addColorStop(1, "rgba(255,255,255,0)");

            ctx.fillStyle = smoke;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Blue smoke on left
        drawSmoke(90, 300, 230, "rgba(21,156,255,0.18)");
        drawSmoke(160, 770, 240, "rgba(21,156,255,0.12)");

        // Pink smoke on right
        drawSmoke(1510, 300, 230, "rgba(255,40,107,0.18)");
        drawSmoke(1450, 770, 240, "rgba(255,40,107,0.12)");

        // Supply crates
        function drawCrate(x, y, size, color) {
            ctx.save();

            ctx.translate(x, y);
            ctx.rotate(-0.08);

            ctx.fillStyle = "#D8E0EA";
            ctx.fillRect(0, 0, size, size);

            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, size, size);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size, size);
            ctx.moveTo(size, 0);
            ctx.lineTo(0, size);
            ctx.stroke();

            ctx.restore();
        }

        drawCrate(70, 700, 100, blue);
        drawCrate(1430, 700, 100, pink);

        // --------------------------------------------------
        // 6. HEADER
        // --------------------------------------------------

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText("T W O   S O U L S   •   O N E   S Q U A D", width / 2, 105);

        ctx.font = "italic bold 82px sans-serif";
        ctx.fillStyle = dark;
        ctx.fillText("Perfect", width / 2, 185);

        ctx.font = "italic bold 105px sans-serif";
        ctx.fillStyle = pink;
        ctx.fillText("PAIR", width / 2, 270);

        // Underline
        ctx.beginPath();
        ctx.moveTo(620, 310);
        ctx.lineTo(980, 310);
        ctx.lineWidth = 8;
        ctx.strokeStyle = pink;
        ctx.stroke();

        ctx.restore();

        // --------------------------------------------------
        // 7. PROFILE AVATARS
        // --------------------------------------------------

        function drawCircularAvatar(img, x, y, size, color) {
            const cx = x + size / 2;
            const cy = y + size / 2;

            // Glow
            ctx.save();

            ctx.shadowColor = color;
            ctx.shadowBlur = 25;

            ctx.beginPath();
            ctx.arc(cx, cy, size / 2 + 8, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();

            // Dark backing
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2 + 4, 0, Math.PI * 2);
            ctx.fillStyle = dark;
            ctx.fill();

            // Actual Facebook profile pic
            ctx.save();

            ctx.beginPath();
            ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
            ctx.clip();

            ctx.drawImage(img, x, y, size, size);

            // Slight dark tint for gaming effect
            ctx.fillStyle = "rgba(10,20,35,0.10)";
            ctx.fillRect(x, y, size, size);

            ctx.restore();

            // Neon ring
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2 + 3, 0, Math.PI * 2);
            ctx.lineWidth = 9;
            ctx.strokeStyle = color;
            ctx.stroke();

            // Inner thin ring
            ctx.beginPath();
            ctx.arc(cx, cy, size / 2 - 8, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255,255,255,0.65)";
            ctx.stroke();
        }

        const avatarSize = 300;
        const avatarY = 330;

        const leftX = 190;
        const rightX = width - 190 - avatarSize;

        drawCircularAvatar(avatar1, leftX, avatarY, avatarSize, blue);
        drawCircularAvatar(avatar2, rightX, avatarY, avatarSize, pink);

        // --------------------------------------------------
        // 8. CROWN DECORATIONS
        // --------------------------------------------------

        function drawCrown(x, y, color) {
            ctx.save();

            ctx.translate(x, y);

            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(-35, 10);
            ctx.lineTo(-42, -18);
            ctx.lineTo(-17, -2);
            ctx.lineTo(0, -35);
            ctx.lineTo(17, -2);
            ctx.lineTo(42, -18);
            ctx.lineTo(35, 10);
            ctx.closePath();
            ctx.fill();

            ctx.fillRect(-35, 13, 70, 9);

            ctx.restore();
        }

        drawCrown(leftX + avatarSize / 2, avatarY - 20, blue);
        drawCrown(rightX + avatarSize / 2, avatarY - 20, pink);

        // --------------------------------------------------
        // 9. CENTER HEART LOCK SCOPE
        // --------------------------------------------------

        const centerX = width / 2;
        const centerY = 480;

        // Connector lines
        ctx.save();

        ctx.strokeStyle = "rgba(255,40,107,0.65)";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(leftX + avatarSize + 15, centerY);
        ctx.lineTo(centerX - 105, centerY);
        ctx.moveTo(centerX + 105, centerY);
        ctx.lineTo(rightX - 15, centerY);
        ctx.stroke();

        ctx.restore();

        // Outer rings
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
        ctx.lineWidth = 7;
        ctx.strokeStyle = pink;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 82, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,40,107,0.45)";
        ctx.stroke();

        // Scope ticks
        ctx.strokeStyle = pink;
        ctx.lineWidth = 5;

        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(i * Math.PI / 2);

            ctx.beginPath();
            ctx.moveTo(0, -125);
            ctx.lineTo(0, -92);
            ctx.stroke();

            ctx.restore();
        }

        // Heart shape
        function drawHeart(x, y, size, color) {
            ctx.save();

            ctx.translate(x, y);
            ctx.scale(size / 100, size / 100);

            ctx.beginPath();
            ctx.moveTo(0, 35);
            ctx.bezierCurveTo(-55, 0, -55, -45, -25, -45);
            ctx.bezierCurveTo(-8, -45, 0, -30, 0, -22);
            ctx.bezierCurveTo(0, -30, 8, -45, 25, -45);
            ctx.bezierCurveTo(55, -45, 55, 0, 0, 35);
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();
        }

        drawGlowCircle(centerX, centerY, 15, pink, 30);
        drawHeart(centerX, centerY, 110, pink);

        // Heart highlight
        drawHeart(centerX, centerY + 8, 45, "#FFFFFF");

        // --------------------------------------------------
        // 10. PLAYER NAME PLATES
        // --------------------------------------------------

        function drawNamePlate(x, y, w, h, color, name, crownColor) {
            ctx.save();

            // Plate shadow
            ctx.shadowColor = "rgba(15,23,42,0.22)";
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = dark;

            ctx.beginPath();
            ctx.moveTo(x + 20, y);
            ctx.lineTo(x + w - 20, y);
            ctx.lineTo(x + w, y + h / 2);
            ctx.lineTo(x + w - 20, y + h);
            ctx.lineTo(x + 20, y + h);
            ctx.lineTo(x, y + h / 2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

            // Colored accent
            ctx.fillStyle = color;
            ctx.fillRect(x + 18, y + h - 7, w - 36, 7);

            // Crown icon
            drawCrown(x + 65, y + h / 2 + 2, crownColor);

            // Name
            const displayName =
                name.length > 20 ? name.substring(0, 18) + ".." : name;

            const fontSize = fitText(displayName, w - 150, 32);

            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = white;

            ctx.fillText(
                displayName,
                x + w / 2 + 35,
                y + h / 2,
                w - 150
            );
        }

        drawNamePlate(
            125, 675, 540, 100,
            blue, name1, blue
        );

        drawNamePlate(
            935, 675, 540, 100,
            pink, name2, pink
        );

        // --------------------------------------------------
        // 11. COMPATIBILITY SCORE
        // --------------------------------------------------

        ctx.save();

        // Score plate
        roundedRect(centerX - 155, 790, 310, 110, 24);

        ctx.fillStyle = pink;
        ctx.fill();

        ctx.shadowColor = pink;
        ctx.shadowBlur = 20;

        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();

        drawText(`${score}%`, centerX, 830, 65, white);

        drawText("PAIR SCORE", centerX, 872, 22, white);

        // --------------------------------------------------
        // 12. FOOTER BADGES
        // --------------------------------------------------

        const badgeY = 925;

        ctx.save();

        ctx.strokeStyle = "rgba(100,116,139,0.55)";
        ctx.lineWidth = 2;

        roundedRect(300, badgeY - 22, 1000, 44, 20);
        ctx.stroke();

        ctx.restore();

        drawText("♥  GOOD VIBES", 470, badgeY, 20, dark);
        drawText("◎  PERFECT MATCH", centerX, badgeY, 20, dark);
        drawText("♟  BATTLE TOGETHER", 1130, badgeY, 20, dark);

        // Branding
        drawText(
            "POWERED BY AHMAD RDX",
            centerX,
            970,
            19,
            "#64748B"
        );

        // --------------------------------------------------
        // 13. SAVE CARD
        // --------------------------------------------------

        const cacheDir = path.join(__dirname, "cache");

        await fs.ensureDir(cacheDir);

        cardPath = path.join(
            cacheDir,
            `pair_${senderID}_${Date.now()}.png`
        );

        await fs.writeFile(cardPath, canvas.toBuffer("image/png"));

        // --------------------------------------------------
        // 14. SEND RESULT
        // --------------------------------------------------

        if (loadingMsg && loadingMsg.messageID) {
            await api.unsendMessage(loadingMsg.messageID);
        }

        const matchStatus =
            score > 80
                ? "🎯 Perfect Headshot Match!"
                : score > 50
                    ? "💥 Strong Duo!"
                    : "⚠️ Enjoying Together & Try Again!";

        const msgBody =
            `🎮 𝐀𝐇𝐌𝐀𝐃 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐏𝐀𝐈𝐑 🎮\n\n` +
            `🔫 Member 1: ${name1}\n` +
            `🎯 Member 2: ${name2}\n\n` +
            `💖 Pair Score: ${score}%\n` +
            `${matchStatus}\n\n` +
            `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

        return api.sendMessage(
            {
                body: msgBody,
                mentions: [
                    { id: senderID, tag: name1 },
                    { id: partnerID, tag: name2 }
                ],
                attachment: fs.createReadStream(cardPath)
            },
            threadID,
            async () => {
                try {
                    if (cardPath && await fs.pathExists(cardPath)) {
                        await fs.unlink(cardPath);
                    }
                } catch (err) {
                    console.error("[PAIR CLEANUP ERROR]:", err);
                }
            },
            messageID
        );

    } catch (e) {
        console.error("[PAIR ERROR]:", e);

        if (loadingMsg && loadingMsg.messageID) {
            try {
                await api.unsendMessage(loadingMsg.messageID);
            } catch (_) {}
        }

        return api.sendMessage(
            "❌ Pair card generate karne mein error aaya! Console check karein.",
            threadID,
            messageID
        );
    }
};
