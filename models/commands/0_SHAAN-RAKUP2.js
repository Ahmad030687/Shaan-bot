/**
 * Module: VIP Rankup Card (HD Glassmorphism Canvas)
 * Path: Sardar/commands/rankup.js
 * Credits: SHAAN BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "SHAAN-RANKUP-CARD",
  version: "10.1.0-HD-WHITE",
  hasPermssion: 1,
  credits: "SHAAN BABU", // Strict core credit preserved
  description: "HD VIP Rankup Card generator with ultra-premium AHMAD RDX branding",
  commandCategory: "LEVEL UP",
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Currencies, Users }) {
  const { threadID, senderID } = event;
  if (!senderID || senderID == api.getCurrentUserID()) return;

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { createCanvas, loadImage } = require("canvas");

  // ===== EXP CALCULATIONS =====
  let exp = (await Currencies.getData(senderID)).exp || 0;
  exp += 1;
  const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3)) + 1) / 2);
  const nextLevel = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3)) + 1) / 2);

  if (nextLevel <= curLevel || nextLevel === 1) {
    await Currencies.setData(senderID, { exp });
    return;
  }

  const name = await Users.getNameUser(senderID);

  try {
    // ===== AVATAR FETCHING =====
    let avatar;
    try {
      const avatarURL = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarData = await axios.get(avatarURL, { responseType: "arraybuffer" });
      avatar = await loadImage(Buffer.from(avatarData.data));
    } catch (e) {
      // Fallback blank circular image canvas
      const fallbackCanvas = createCanvas(512, 512);
      const fbCtx = fallbackCanvas.getContext("2d");
      fbCtx.fillStyle = "#22ff88";
      fbCtx.fillRect(0, 0, 512, 512);
      avatar = await loadImage(fallbackCanvas.toBuffer());
    }

    // ===== CANVAS SETUP (1200 x 500) =====
    const width = 1200;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // ===== NEON DARK GRADIENT BACKGROUND =====
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#020b0a");
    gradient.addColorStop(0.5, "#062e22");
    gradient.addColorStop(1, "#020b0a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // ===== DECORATIVE GLOW ORBS =====
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 80,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ===== GLASSMORPHISM FRAME =====
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.strokeStyle = "rgba(34, 255, 136, 0.3)";
    ctx.lineWidth = 3;
    ctx.fillRect(40, 40, width - 80, height - 80);
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // ===== AVATAR RENDERING =====
    const avatarSize = 260;
    const avatarX = 100;
    const avatarY = 120;

    // Outer Neon Glow
    ctx.shadowColor = "#22ff88";
    ctx.shadowBlur = 45;
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#22ff88";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clip Image
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Border Frame
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#22ff88";
    ctx.stroke();

    // ===== CARD TEXT =====
    ctx.font = "bold 68px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
    ctx.shadowBlur = 15;
    ctx.fillText("LEVEL UP!", 420, 150);
    ctx.shadowBlur = 0;

    ctx.font = "bold 46px Sans";
    ctx.fillStyle = "#22ff88";
    ctx.fillText(name, 420, 225);

    ctx.font = "36px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`You reached Level ${nextLevel}! 🔥`, 420, 290);

    ctx.font = "bold 28px Sans";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("POWERED BY: AHMAD RDX", 420, 360);

    // ===== FILE SAVING =====
    const imgPath = __dirname + `/cache/rankup_${senderID}_${Date.now()}.png`;
    fs.writeFileSync(imgPath, canvas.toBuffer());

    // ===== MESSAGE BROADCAST =====
    const msgBody =
      "╔════════════════════════╗\n" +
      "║   🎉 LEVEL UP ACHIEVED 🎉 ║\n" +
      "╚════════════════════════╝\n\n" +
      `👤 Member: ${name}\n` +
      `⚡ New Rank: Level ${nextLevel}\n` +
      "💬 Mubarak ho! Aapne naya level haasil kar liya hai.\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 POWERED BY: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    api.sendMessage(
      {
        body: msgBody,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    );
  } catch (err) {
    console.error("[RANKUP ERROR]:", err);
  }

  await Currencies.setData(senderID, { exp });
};

// ===== ON / OFF TOGGLE =====
module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data || {};

  data.rankup = !data.rankup;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  const statusMsg = data.rankup ? 
    "╔════════════════════════╗\n" +
    "║  👑 VIP RANKUP CARD: ON ║\n" +
    "╚════════════════════════╝\n\n" +
    "⚡ Rankup level notifications activated for this group!\n\n" +
    "👑 POWERED BY: AHMAD RDX" :
    "╔════════════════════════╗\n" +
    "║  ❌ VIP RANKUP CARD: OFF║\n" +
    "╚════════════════════════╝\n\n" +
    "🚫 Rankup level notifications deactivated for this group!\n\n" +
    "👑 POWERED BY: AHMAD RDX";

  return api.sendMessage(statusMsg, threadID, messageID);
};
