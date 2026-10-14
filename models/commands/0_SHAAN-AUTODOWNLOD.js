/**
 * Module: Link Auto Downloader
 * Path: Sardar/commands/linkAutoDownload.js
 * Credits: Shaan Babu (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports = {
  config: {
    name: "linkAutoDownload",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Shaan Babu", // Strict core credit preserved
    description: "Auto-downloads videos from URLs with ultra-premium AHMAD RDX branding",
    commandCategory: "Utilities",
    usages: "",
    cooldowns: 5,
  },

  onLoad: function () {
    const fs = require("fs");
    const path = __filename;
    const fileData = fs.readFileSync(path, "utf8");

    if (!fileData.includes('credits: "Shaan Babu"')) {
      console.log("\n❌ ERROR: Credits Badle Gaye Hain! File Disabled ❌\n");
      process.exit(1);
    }
  },

  run: async function () {},

  handleEvent: async function ({ api, event }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const { alldown } = require("arif-babu-downloader");

    const body = (event.body || "").trim();
    if (!body.startsWith("https://")) return;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const data = await alldown(body);

      if (!data || !data.data || !data.data.high) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("❌ [ AHMAD RDX ] Valid download link or stream not found!", event.threadID, event.messageID);
      }

      const videoTitle = data.data.title || data.title || "Auto Downloaded Media";
      const videoURL = data.data.high;
      const filePath = __dirname + `/cache/auto_${event.senderID}_${Date.now()}.mp4`;

      const response = await axios.get(videoURL, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const downloadText = 
        "╔════════════════════════╗\n" +
        "║  ⚡ AUTO DOWNLOADER ⚡  ║\n" +
        "╚════════════════════════╝\n\n" +
        `🎬 Title: ${videoTitle}\n` +
        "⚡ Status: Downloaded Successfully!\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 POWERED BY: AHMAD RDX\n" +
        "📱 WhatsApp: +92306*******\n" +
        "✈️ Telegram: ahmadalisafdar3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

      return api.sendMessage(
        {
          body: downloadText,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        event.messageID
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },
};
