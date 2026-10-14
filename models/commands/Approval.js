/**
 * Module: Group Approval System
 * Path: Sardar/commands/approve.js
 * Credits: MR.SHAAN (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const path = require("path");

const dataPath = path.join(__dirname, "cache", "approvedThreads.json");
const dataPending = path.join(__dirname, "cache", "pendingdThreads.json");

module.exports.config = {
  name: "approve",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "MR.SHAAN", // Strict core credit preserved
  description: "Group approval management module with ultra-premium AHMAD RDX branding",
  commandCategory: "Admin",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
  if (handleReply.author != event.senderID) return;
  const { body, threadID, messageID } = event;
  const { type } = handleReply;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = (args && args[0]) ? args[0] : threadID;

  switch (type) {
    case "pending": {
      if (body.toUpperCase() === "A") {
        if (!data.includes(idBox)) data.push(idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        const welcomeMsg = 
          "╔════════════════════════╗\n" +
          "║  🎉 GROUP APPROVED! 🎉  ║\n" +
          "╚════════════════════════╝\n\n" +
          "💐 Mubarak Ho! Aapke group ko AHMAD RDX ne approve kar diya hai.\n\n" +
          "📌 System Status: ONLINE & ACTIVE\n" +
          `🆔 Approved GC ID: ${idBox}\n\n` +
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
          "👑 SYSTEM OWNER: AHMAD RDX\n" +
          "📱 WhatsApp: +92306*******\n" +
          "✈️ Telegram: ahmadalisafdar3\n" +
          "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

        api.sendMessage(welcomeMsg, threadID, () => {
          if (dataP.includes(idBox)) {
            dataP.splice(dataP.indexOf(idBox), 1);
            fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
          }
        }, messageID);
      }
      break;
    }
  }
};

module.exports.run = async ({ event, api, args, Threads, Users }) => {
  const { threadID, messageID } = event;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = (args[0] && !isNaN(args[0])) ? args[0] : threadID;

  // ===== LIST APPROVED GROUPS =====
  if (args[0] == "list" || args[0] == "l") {
    let msg = 
      "╔════════════════════════╗\n" +
      `║ 📜 APPROVED GROUPS (${data.length}) ║\n` +
      "╚════════════════════════╝\n\n";

    let count = 0;
    for (let e of data) {
      try {
        let threadInfo = await api.getThreadInfo(e);
        let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
        msg += `✨ [ ${++count} ] ➔ ${threadName}\n🆔 ID: ${e}\n\n`;
      } catch (err) {
        msg += `✨ [ ${++count} ] ➔ Unknown Group\n🆔 ID: ${e}\n\n`;
      }
    }

    msg += 
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******";

    return api.sendMessage(msg, threadID, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "a",
      });
    }, messageID);
  }

  // ===== LIST PENDING GROUPS =====
  else if (args[0] == "pending" || args[0] == "p") {
    let msg = 
      "╔════════════════════════╗\n" +
      `║ ⏳ PENDING GROUPS (${dataP.length}) ║\n` +
      "╚════════════════════════╝\n\n";

    let count = 0;
    for (let e of dataP) {
      try {
        let threadInfo = await api.getThreadInfo(e);
        let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
        msg += `✨ [ ${++count} ] ➔ ${threadName}\n🆔 ID: ${e}\n\n`;
      } catch (err) {
        msg += `✨ [ ${++count} ] ➔ Unknown Group\n🆔 ID: ${e}\n\n`;
      }
    }

    msg += 
      "💡 Reply 'A' on pending item to approve!\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX";

    return api.sendMessage(msg, threadID, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        type: "pending",
      });
    }, messageID);
  }

  // ===== HELP MENU =====
  else if (args[0] == "help" || args[0] == "h") {
    const threadData = (await Threads.getData(String(threadID))).data || {};
    const prefix = threadData.PREFIX || global.config.PREFIX;

    const helpText = 
      "╔════════════════════════╗\n" +
      "║  📖 APPROVAL COMMANDS  ║\n" +
      "╚════════════════════════╝\n\n" +
      `⚡ ${prefix}approve l/list ➔ View list of approved groups\n` +
      `⚡ ${prefix}approve p/pending ➔ View list of pending groups\n` +
      `⚡ ${prefix}approve d/del [ID] ➔ Remove a group from approved list\n` +
      `⚡ ${prefix}approve [ID] ➔ Directly approve specified group ID\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    return api.sendMessage(helpText, threadID, messageID);
  }

  // ===== REMOVE / UNAPPROVE GROUP =====
  else if (args[0] == "del" || args[0] == "d") {
    idBox = (args[1]) ? args[1] : threadID;
    const reason = args.slice(2).join(" ") || "No reason specified";

    if (isNaN(parseInt(idBox))) {
      return api.sendMessage("❌ [ AHMAD RDX ] Provided ID is not a valid number!", threadID, messageID);
    }
    if (!data.includes(idBox)) {
      return api.sendMessage("❌ [ AHMAD RDX ] Specified box is not pre-approved!", threadID, messageID);
    }

    const removeNotice = 
      "╔════════════════════════╗\n" +
      "║ ⚠️ APPROVAL REVOKED    ║\n" +
      "╚════════════════════════╝\n\n" +
      "❌ Aapke group ki approval AHMAD RDX dwara khatam kar di gayi hai.\n" +
      `💬 Reason: ${reason}\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX";

    api.sendMessage(removeNotice, idBox);

    data.splice(data.indexOf(idBox), 1);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return api.sendMessage(`✅ [ AHMAD RDX ] Group ${idBox} successfully removed from approved list!`, threadID, messageID);
  }

  // ===== DIRECT APPROVE PROCESS =====
  else {
    if (isNaN(parseInt(idBox))) {
      return api.sendMessage("❌ [ AHMAD RDX ] Invalid Group ID provided!", threadID, messageID);
    }

    if (data.includes(idBox)) {
      return api.sendMessage(`ℹ️ [ AHMAD RDX ] Group ID ${idBox} is already approved!`, threadID, messageID);
    }

    const approveNotice = 
      "╔════════════════════════╗\n" +
      "║  💐 GROUP APPROVED 💐  ║\n" +
      "╚════════════════════════╝\n\n" +
      "🎉 MUBARAK HO! Aapka group AHMAD RDX dwaara approve ho chuka hai!\n\n" +
      "⚡ Ab aap bot ke tamam features mazay se istemal kar sakte hain.\n" +
      `💡 Type '${global.config.PREFIX}help' to view command list.\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "🔗 Facebook: https://www.facebook.com/profile.php?id=100002944872037\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    api.sendMessage(approveNotice, idBox, (error) => {
      if (error) {
        return api.sendMessage("❌ [ AHMAD RDX ] Approval failed! Make sure the bot is inside the target group.", threadID, messageID);
      } else {
        if (!data.includes(idBox)) data.push(idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        if (dataP.includes(idBox)) {
          dataP.splice(dataP.indexOf(idBox), 1);
          fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
        }

        return api.sendMessage(`✅ [ AHMAD RDX ] Successfully Approved Box ID: ${idBox}`, threadID, messageID);
      }
    });
  }
};
