module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const moment = require("moment-timezone");

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Karachi").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands } = global.client;
    var { body, senderID, threadID, messageID } = event;

    if (!body) return;
    senderID = String(senderID);
    threadID = String(threadID);

    const threadSetting = threadData.get(threadID) || {};
    const currentPrefix = threadSetting.PREFIX || PREFIX || ".";
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(currentPrefix)})\\s*`);

    if (!prefixRegex.test(body)) return;

    const adminbot = require('../../config.json');

    if (!global.data.allThreadID.includes(threadID) && !ADMINBOT.includes(senderID) && adminbot.adminPaOnly === true) {
      return api.sendMessage("MODE » Only admins can use bots in their own inbox", threadID, messageID);
    }
    if (!ADMINBOT.includes(senderID) && adminbot.adminOnly === true) {
      return api.sendMessage('MODE » Only admins can use bots', threadID, messageID);
    }
    if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.ndhOnly === true) {
      return api.sendMessage('MODE » Only bot support can use bots', threadID, messageID);
    }

    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID === threadID)) {
      if (!ADMINBOT.includes(senderID)) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            if (info?.messageID) api.unsendMessage(info.messageID);
          }, messageID);
        } else if (threadBanned.has(threadID)) {
          const { reason, dateAdded } = threadBanned.get(threadID) || {};
          return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            if (info?.messageID) api.unsendMessage(info.messageID);
          }, messageID);
        }
      }
    }

    const [matchedPrefix] = body.match(prefixRegex);
    const args = body.slice(matchedPrefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();
    var command = commands.get(commandName);

    if (!command) {
      var allCommandName = Array.from(commands.keys());
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) {
        command = commands.get(checker.bestMatch.target);
      } else {
        return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID, messageID);
      }
    }

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name) || banUsers.includes(command.config.name)) {
          return api.sendMessage(`❌ Command '${command.config.name}' is currently disabled for you.`, threadID, messageID);
        }
      }
    }

    var permssion = 0;
    try {
      var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID)) || {};
      const findAdmin = (threadInfoo.adminIDs || []).find(el => el.id === senderID);
      if (NDH.includes(senderID)) permssion = 2;
      if (ADMINBOT.includes(senderID)) permssion = 3;
      else if (findAdmin) permssion = 1;
    } catch (e) {}

    if (command.config.hasPermssion > permssion) {
      return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name), threadID, messageID);
    }

    if (!global.client.cooldowns.has(command.config.name)) {
      global.client.cooldowns.set(command.config.name, new Map());
    }
    const timestamps = global.client.cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
      const timeLeft = ((timestamps.get(senderID) + expirationTime - dateNow) / 1000).toFixed(1);
      return api.sendMessage(`⏳ Please wait ${timeLeft}s before using '${command.config.name}' again.`, threadID, messageID);
    }

    // 🌟 REAL HUMAN TYPING INDICATOR SIMULATION 🌟
    try {
      if (typeof api.sendTypingIndicator === 'function') {
        api.sendTypingIndicator(threadID, (err) => {});
      }
    } catch (e) {}

    // Human-like micro delay before responding
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 400) + 300));

    var getText2 = () => {};
    if (command.languages && typeof command.languages === 'object' && command.languages.hasOwnProperty(global.config.language)) {
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || '';
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }

    try {
      const Obj = { api, event, args, models, Users, Threads, Currencies, permssion, getText: getText2 };
      await command.run(Obj);
      timestamps.set(senderID, dateNow);
      if (DeveloperMode) {
        logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
      }
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID, messageID);
    }
  };
};
