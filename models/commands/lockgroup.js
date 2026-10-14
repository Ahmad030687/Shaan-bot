/**
 * Module: Group Lock (Auto Security Protection)
 * Path: Sardar/commands/lockgroup.js
 * Credits: Shaan (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "lockgroup",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "Shaan", // Strict core credit preserved
  description: "Locks group name & photo, auto-resets on unauthorized changes with AHMAD RDX security",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5
};

const lockData = {}; // RAM-based security lock memory

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      "╔════════════════════════╗\n" +
      "║ ⚠️ INVALID COMMAND USAGE║\n" +
      "╚════════════════════════╝\n\n" +
      "💡 Please use option: lockgroup on OR lockgroup off\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 POWERED BY: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******",
      threadID,
      messageID
    );
  }

  const option = args[0].toLowerCase();

  if (option === "on") {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "";
      const groupImageSrc = threadInfo.imageSrc;

      let imagePath = null;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      // Download and save group image for protection
      if (groupImageSrc) {
        const img = await axios.get(groupImageSrc, { responseType: "arraybuffer" });
        imagePath = path.join(cacheDir, `group_lock_${threadID}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(img.data, "binary"));
      }

      lockData[threadID] = {
        name: groupName,
        image: imagePath
      };

      const lockSuccessMsg = 
        "╔════════════════════════╗\n" +
        "║  🔒 GROUP LOCK ACTIVATED║\n" +
        "╚════════════════════════╝\n\n" +
        "🛡️ Protection Status: ACTIVE\n" +
        "🏷️ Locked Name: " + (groupName || "Default Name") + "\n" +
        "🖼️ Image Protection: Enabled\n\n" +
        "⚡ Koi bhi group name ya photo change karega toh auto-reset ho jayega!\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 SYSTEM OWNER: AHMAD RDX\n" +
        "📱 WhatsApp: +92306*******\n" +
        "✈️ Telegram: ahmadalisafdar3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

      return api.sendMessage(lockSuccessMsg, threadID, messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage(
        "╔════════════════════════╗\n" +
        "║ ⚠️ SECURITY LOCK ERROR ║\n" +
        "╚════════════════════════╝\n\n" +
        "❌ Lock activate karne mein error aaya hai!",
        threadID,
        messageID
      );
    }
  }

  if (option === "off") {
    if (!lockData[threadID]) {
      return api.sendMessage(
        "╔════════════════════════╗\n" +
        "║ ⚠️ STATUS ALERT        ║\n" +
        "╚════════════════════════╝\n\n" +
        "ℹ️ Group pehle se unlocked hai!\n\n" +
        "👑 POWERED BY: AHMAD RDX",
        threadID,
        messageID
      );
    }

    if (lockData[threadID].image && fs.existsSync(lockData[threadID].image)) {
      fs.unlinkSync(lockData[threadID].image);
    }
    delete lockData[threadID];

    const unlockMsg = 
      "╔════════════════════════╗\n" +
      "║ 🔓 GROUP UNLOCKED      ║\n" +
      "╚════════════════════════╝\n\n" +
      "✅ Group protection successfully disabled!\n" +
      "👥 Ab members group name aur photo change kar sakte hain.\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3";

    return api.sendMessage(unlockMsg, threadID, messageID);
  }

  return api.sendMessage("❌ Invalid option! Use: lockgroup on/off", threadID, messageID);
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;
  if (!lockData[threadID]) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const currentName = threadInfo.threadName;
    const currentImage = threadInfo.imageSrc;

    const { name: lockedName, image: lockedImagePath } = lockData[threadID];

    // Check name tamper
    if (currentName !== lockedName) {
      await api.setTitle(lockedName, threadID);
      const nameResetMsg = 
        "╔════════════════════════╗\n" +
        "║ 🚨 SECURITY WARNING    ║\n" +
        "╚════════════════════════╝\n\n" +
        "⚠️ Unauthorized Name Change Detected!\n" +
        `🔄 Group name auto-reset back to: "${lockedName}"\n\n` +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 POWERED BY: AHMAD RDX";
      api.sendMessage(nameResetMsg, threadID);
    }

    // Check photo tamper
    if (lockedImagePath && currentImage && fs.existsSync(lockedImagePath)) {
      const currentImgRes = await axios.get(currentImage, { responseType: "arraybuffer" });
      const currentBuffer = Buffer.from(currentImgRes.data, "binary");
      const lockedBuffer = fs.readFileSync(lockedImagePath);

      if (!currentBuffer.equals(lockedBuffer)) {
        await api.changeGroupImage(fs.createReadStream(lockedImagePath), threadID);
        const imgResetMsg = 
          "╔════════════════════════╗\n" +
          "║ 🚨 SECURITY WARNING    ║\n" +
          "╚════════════════════════╝\n\n" +
          "⚠️ Unauthorized Photo Change Detected!\n" +
          "🔄 Group photo auto-reset back to protected avatar.\n\n" +
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
          "👑 POWERED BY: AHMAD RDX";
        api.sendMessage(imgResetMsg, threadID);
      }
    }
  } catch (err) {
    console.log("[LOCKGROUP SECURITY ERROR]:", err.message);
  }
};
