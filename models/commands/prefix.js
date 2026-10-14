module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SHAAN BABU",
  description: "Show bot prefix with date & time",
  commandCategory: "system",
  usages: "prefix",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api }) => {
  const { threadID, messageID, body } = event;

  if (!body) return;

  const trigger = ["prefix", "mprefix", "mpre", "bot prefix", "prefix kya hai"];
  if (!trigger.includes(body.toLowerCase())) return;

  const threadSetting =
    global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // 🇵🇰 PAKISTAN DATE & TIME
  const now = new Date();

  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const date = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const day = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Karachi",
    weekday: "long"
  });

  const msg = `
▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰
   🎉 ✧ PREFIX ✧ ✅
✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦

✰ PREFIX ➪ ${prefix}
✰ TIME ➪ ${time}
✰ DATE ➪ ${date}
✰ DAY ➪ ${day}

༺══─────────══༻
MADE BY ❤️‍🔥 AHMAD RDX
`;

  return api.sendMessage(msg, threadID, messageID);
};

module.exports.run = async ({ event, api }) => {
  const threadSetting =
    global.data.threadData.get(parseInt(event.threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  //🇵🇰 PAKISTAN DATE & TIME
  const now = new Date();

  const time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const date = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const day = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Karachi",
    weekday: "long"
  });

  const msg = `
▰▰▰▰▰ ★ • ✧ • ★ ▰▰▰▰▰
   🎉 ✧ PREFIX ✧ ✅
✦••┈┈┈┈┈┈┈ ✧ ┈┈┈┈┈┈┈••✦

✰ PREFIX ➪ ${prefix}
✰ TIME ➪ ${time}
✰ DATE ➪ ${date}
✰ DAY ➪ ${day}

༺══─────────══༻
MADE BY ❤️‍🔥 AHMAD RDX 
`;

  return api.sendMessage(msg, event.threadID);
};
