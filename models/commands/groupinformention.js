/**
 * Module: Group Information
 * Path: Sardar/commands/groupinf.js
 * Credits: SHAAN BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "groupinf",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "SHAAN BABU", // Strict core credit preserved
  description: "Displays full detailed information of the group with ultra-premium AHMAD RDX branding",
  commandCategory: "GROUP INFORMETION",
  usages: "groupinf",
  cooldowns: 2,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  try {
    let threadInfo = await api.getThreadInfo(event.threadID);
    let threadMem = threadInfo.participantIDs.length;
    
    var gendernam = [];
    var gendernu = [];
    var nope = [];

    for (let z in threadInfo.userInfo) {
      var gioitinhone = threadInfo.userInfo[z].gender;
      var nName = threadInfo.userInfo[z].name;
      if (gioitinhone == "MALE") {
        gendernam.push(z + gioitinhone);
      } else if (gioitinhone == "FEMALE") {
        gendernu.push(gioitinhone);
      } else {
        nope.push(nName);
      }
    }

    var nam = gendernam.length;
    var nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let icon = threadInfo.emoji || "👍";
    let threadName = threadInfo.threadName || "No Group Name";
    let id = threadInfo.threadID;
    let sex = threadInfo.approvalMode;
    var pd = sex == false ? 'TURNED OFF ❌' : sex == true ? 'TURNED ON ✅' : 'NOTHING';

    const infoText = 
      "╔════════════════════════╗\n" +
      "║  📊 GROUP INFORMATION 📊  ║\n" +
      "╚════════════════════════╝\n\n" +
      `🏷️ Group Name: ${threadName}\n` +
      `🆔 Group UID: ${id}\n` +
      `🛡️ Approval Mode: ${pd}\n` +
      `😃 Group Emoji: ${icon}\n\n" +
      "📌 MEMBERS DETAILS:\n" +
      `👥 Total Members: ${threadMem}\n` +
      `👨 Total Males: ${nam}\n` +
      `👩 Total Females: ${nu}\n` +
      `👑 Total Admins: ${qtv}\n` +
      `💬 Total Messages: ${sl}\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 POWERED BY: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    const imagePath = __dirname + `/cache/group_info_${event.threadID}.png`;

    if (threadInfo.imageSrc) {
      const callback = () => {
        api.sendMessage(
          {
            body: infoText,
            attachment: fs.createReadStream(imagePath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
          },
          event.messageID
        );
      };

      return request(encodeURI(`${threadInfo.imageSrc}`))
        .pipe(fs.createWriteStream(imagePath))
        .on("close", () => callback());
    } else {
      return api.sendMessage(infoText, event.threadID, event.messageID);
    }
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Error fetching group details!", event.threadID, event.messageID);
  }
};
	  
