/**
 * Module: Help2 (All Commands List & Guide)
 * Path: Sardar/commands/help2.js
 * Credits: SHAAN BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
  name: "help",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAAN BABU", // Strict core credit preserved
  description: "Displays full list of available bot commands with ultra-premium AHMAD RDX branding",
  usePrefix: true,
  commandCategory: "BOT-ALL-COMMAND-NAME",
  usages: "help2 [command_name/page]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": 
      "╔════════════════════════╗\n" +
      "║  📌 COMMAND INFORMATION ║\n" +
      "╚════════════════════════╝\n\n" +
      "🏷️ Command: %1\n" +
      "📝 Description: %2\n\n" +
      "💡 Usage: %3\n" +
      "📂 Category: %4\n" +
      "⏱️ Cooldown: %5 second(s)\n" +
      "🛡️ Permission: %6\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 POWERED BY: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "helpList": '[ Total %1 commands available. Use "%2help <command_name>" for details ]',
    "user": "Everyone (User)",
    "adminGroup": "Group Admin",
    "adminBot": "Bot Owner / Admin"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    getText(
      "moduleInfo", 
      command.config.name, 
      command.config.description, 
      `${prefix}${command.config.name}${(command.config.usages) ? command.config.usages : ""}`, 
      command.config.commandCategory, 
      command.config.cooldowns, 
      ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
      command.config.credits
    ), 
    threadID, 
    messageID
  );
};

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {
    const arrayInfo = [];
    const page = parseInt(args[0]) || 1;
    const numberOfOnePage = 9999;

    let i = 0;
    let msg = "";

    for (var [name, value] of (commands)) {
      name += ``;
      arrayInfo.push(name);
    }

    arrayInfo.sort((a, b) => a.localeCompare(b));

    const startSlice = numberOfOnePage * page - numberOfOnePage;
    i = startSlice;
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

    for (let item of returnArray) {
      msg += `✨ [ ${++i} ] ➔ ${prefix}${item}\n`;
    }

    const header = 
      "╔════════════════════════╗\n" +
      "║   ⚡ AHMAD RDX SYSTEM ⚡   ║\n" +
      "╚════════════════════════╝\n\n" +
      "📜 ════ ALL COMMANDS MENU ════ 📜\n\n";

    const footer = 
      `\n📌 PAGE [ ${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)} ]\n` +
      `💡 Total Commands: ${arrayInfo.length}\n` +
      `💬 Usage Example: ${prefix}help <command_name>\n\n` +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
      "👑 SYSTEM OWNER: AHMAD RDX\n" +
      "📱 WhatsApp: +92306*******\n" +
      "✈️ Telegram: ahmadalisafdar3\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    return api.sendMessage(header + msg + footer, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      } else return;
    }, event.messageID);
  }

  return api.sendMessage(
    getText(
      "moduleInfo", 
      command.config.name, 
      command.config.description, 
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
      command.config.commandCategory, 
      command.config.cooldowns, 
      ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
      command.config.credits
    ), 
    threadID, 
    messageID
  );
};
