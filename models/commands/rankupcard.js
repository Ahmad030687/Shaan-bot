
module.exports.config = {
  name: "rankup",
  version: "12.0.0-AHMAD-RDX",
  hasPermssion: 1,
  credits: "AHMAD RDX",
  description: "Premium VIP Rankup Card",
  commandCategory: "LEVEL UP",
  dependencies: {
    canvas: "",
    axios: "",
    "fs-extra": ""
  },
  cooldowns: 2
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;

  let threadData = (await Threads.getData(threadID)).data || {};
  threadData.rankup = !threadData.rankup;

  await Threads.setData(threadID, { data: threadData });
  global.data.threadData.set(threadID, threadData);

  return api.sendMessage(
    threadData.rankup
      ? "👑 AHMAD RDX PREMIUM RANKUP CARD ON"
      : "❌ RANKUP CARD OFF",
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({
  api,
  event,
  Currencies,
  Users,
  Threads
}) {
  const { threadID, senderID } = event;

  if (!senderID || !threadID) return;

  // ===== GROUP SETTING CHECK =====
  const threadData = (await Threads.getData(threadID)).data || {};

  if (threadData.rankup !== true) return;

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { createCanvas, loadImage } = require("canvas");

  // ===== XP SYSTEM =====
  const currencyData = await Currencies.getData(senderID);
  let exp = Number(currencyData.exp) || 0;
  exp += 1;

  const getLevel = xp =>
    Math.floor((Math.sqrt(1 + (4 * xp / 3)) + 1) / 2);

  const curLevel = getLevel(exp - 1);
  const nextLevel = getLevel(exp);

  await Currencies.setData(senderID, { exp });

  // Rankup sirf level change par
  if (nextLevel <= curLevel || nextLevel === 1) return;

  // ===== USER INFO =====
  const name = await Users.getNameUser(senderID);

  let avatarURL;

  try {
    const info = await api.getUserInfo(senderID);
    avatarURL = info[senderID]?.profileUrl;
  } catch (e) {
    console.log("Rankup avatar error:", e);
  }

  if (!avatarURL) return;

  // ===== AVATAR DOWNLOAD =====
  let avatar;

  try {
    const response = await axios.get(avatarURL, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    avatar = await loadImage(Buffer.from(response.data));
  } catch (e) {
    console.log("Rankup image download error:", e);
    return;
  }

  // ===== CANVAS =====
  const width = 1200;
  const height = 500;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ===== BACKGROUND =====
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#03030B");
  bg.addColorStop(0.5, "#17082B");
  bg.addColorStop(1, "#050510");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // ===== GLOW EFFECT =====
  function glow(x, y, radius, color) {
    const g = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );

    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.fillRect(
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );
  }

  glow(300, 250, 360, "rgba(130,50,255,0.24)");
  glow(1000, 80, 330, "rgba(255,190,60,0.12)");

  // ===== ROUNDED RECTANGLE =====
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(
      x + w, y + h,
      x + w - r, y + h
    );
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(
      x, y + h,
      x, y + h - r
    );
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ===== MAIN CARD =====
  roundRect(25, 25, 1150, 450, 30);

  ctx.fillStyle = "rgba(255,255,255,0.035)";
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(190,140,255,0.65)";
  ctx.stroke();

  // ===== TOP GOLD LINE =====
  const gold = ctx.createLinearGradient(50, 0, 1150, 0);
  gold.addColorStop(0, "#8A4DFF");
  gold.addColorStop(0.5, "#FFD98A");
  gold.addColorStop(1, "#8A4DFF");

  roundRect(60, 43, 1080, 5, 3);
  ctx.fillStyle = gold;
  ctx.fill();

  // ===== PROFILE AVATAR =====
  const avatarSize = 245;
  const avatarX = 95;
  const avatarY = 110;

  const centerX = avatarX + avatarSize / 2;
  const centerY = avatarY + avatarSize / 2;

  // Avatar glow
  ctx.save();
  ctx.shadowColor = "#A855FF";
  ctx.shadowBlur = 35;

  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    avatarSize / 2 + 5,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#A855FF";
  ctx.fill();
  ctx.restore();

  // Avatar image
  ctx.save();

  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    avatarSize / 2,
    0,
    Math.PI * 2
  );

  ctx.clip();
  ctx.drawImage(
    avatar,
    avatarX,
    avatarY,
    avatarSize,
    avatarSize
  );

  ctx.restore();

  // Gold avatar border
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    avatarSize / 2 + 4,
    0,
    Math.PI * 2
  );

  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FFD98A";
  ctx.stroke();

  // ===== VIP BADGE =====
  roundRect(135, 385, 165, 48, 22);
  ctx.fillStyle = "#FFD98A";
  ctx.fill();

  ctx.font = "bold 24px Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "#17082B";
  ctx.fillText("✦ VIP ✦", 217, 416);

  // ===== LEVEL UP TITLE =====
  ctx.textAlign = "left";

  ctx.font = "bold 66px Sans";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(160,100,255,0.8)";
  ctx.shadowBlur = 20;

  ctx.fillText("LEVEL UP!", 410, 125);
  ctx.shadowBlur = 0;

  // ===== USER NAME =====
  let displayName = String(name || "Member");

  if (displayName.length > 22) {
    displayName = displayName.slice(0, 20) + "...";
  }

  ctx.font = "bold 40px Sans";
  ctx.fillStyle = "#FFD98A";
  ctx.fillText(displayName, 415, 190);

  // ===== CONGRATULATIONS =====
  ctx.font = "24px Sans";
  ctx.fillStyle = "rgba(255,255,255,0.85)";

  ctx.fillText(
    "Congratulations! Your hard work paid off.",
    415,
    235
  );

  // ===== LEVEL TRANSITION BOX =====
  roundRect(405, 265, 660, 100, 20);

  ctx.fillStyle = "rgba(255,255,255,0.055)";
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,217,138,0.55)";
  ctx.stroke();

  // Old level
  ctx.textAlign = "center";
  ctx.font = "bold 30px Sans";
  ctx.fillStyle = "#B8B4C9";

  ctx.fillText(`LEVEL ${curLevel}`, 545, 325);

  // Arrow
  ctx.font = "bold 38px Sans";
  ctx.fillStyle = "#FFD98A";

  ctx.fillText("➜", 735, 325);

  // New level
  ctx.font = "bold 42px Sans";
  ctx.fillStyle = "#FFD98A";

  ctx.fillText(`LEVEL ${nextLevel}`, 925, 327);

  // ===== XP PROGRESS =====
  const currentLevelXP = 3 * curLevel * (curLevel - 1);
  const nextLevelXP = 3 * nextLevel * (nextLevel - 1);

  const progress = Math.max(
    0,
    Math.min(
      1,
      (exp - currentLevelXP) /
      Math.max(1, nextLevelXP - currentLevelXP)
    )
  );

  ctx.textAlign = "left";
  ctx.font = "bold 20px Sans";
  ctx.fillStyle = "#FFFFFF";

  ctx.fillText("XP PROGRESS", 410, 400);

  // Progress bar background
  roundRect(410, 415, 650, 18, 9);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();

  // Progress bar fill
  const barWidth = Math.max(1, 650 * progress);

  roundRect(410, 415, barWidth, 18, 9);

  const xpGradient = ctx.createLinearGradient(410, 0, 1060, 0);
  xpGradient.addColorStop(0, "#8A4DFF");
  xpGradient.addColorStop(1, "#FFD98A");

  ctx.fillStyle = xpGradient;
  ctx.fill();

  // XP numbers
  ctx.font = "bold 17px Sans";
  ctx.fillStyle = "#FFFFFF";

  ctx.fillText(
    `${exp - currentLevelXP} / ${nextLevelXP - currentLevelXP} XP`,
    410,
    455
  );

  // ===== BRANDING =====
  ctx.textAlign = "center";
  ctx.font = "bold 24px Sans";
  ctx.fillStyle = "#FFD98A";

  ctx.fillText("AHMAD RDX", 800, 455);

  // ===== SAVE CARD =====
  const fs = global.nodemodule["fs-extra"];

  const cachePath = __dirname + "/cache";

  fs.ensureDirSync(cachePath);

  const imgPath = cachePath + "/ahmad_rdx_rankup.png";

  fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

  // ===== SEND MESSAGE =====
  const msgBody =
`👑 𝗔𝗛𝗠𝗔𝗗 𝗥𝗗𝗫 𝗥𝗔𝗡𝗞𝗨𝗣 👑

🎉 Congratulations ${displayName}!
🔥 Aap Level ${nextLevel} par pohanch gaye!

💜 Keep Growing • Keep Winning`;

  api.sendMessage(
    {
      body: msgBody,
      attachment: fs.createReadStream(imgPath)
    },
    threadID,
    err => {
      if (err) {
        console.log("Rankup send error:", err);
      }

      fs.unlink(imgPath, () => {});
    }
  );
};
    
