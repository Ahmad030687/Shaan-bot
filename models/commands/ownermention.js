module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐚𝐧 𝐊𝐡𝐚𝐧",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100002944872037") {
    var aid = ["100002944872037"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["𝐘𝐀𝐑 𝐀𝐇𝐌𝐀𝐃 𝐊𝐎 𝐌𝐄𝐍𝐓𝐈𝐎𝐍 𝐍𝐀 𝐊𝐀𝐑𝐎 𝐖𝐎 𝐁𝐔𝐑𝐀 𝐌𝐀𝐍 𝐉𝐀𝐘𝐄 𝐆𝐀😏", "𝐃𝐨𝐨𝐑 𝐇𝐚𝐚𝐓 𝐉𝐚𝐨 𝐌𝐞𝐑𝐞 𝐁𝐨𝐬𝐒 𝐒𝐞 𝐊𝐲𝐔 𝐁𝐨𝐋𝐚 𝐑𝐞𝐇 𝐇𝐨 𝐔𝐧𝐊𝐨 🤨" , "𝐖𝐨 𝐁𝐮𝐒𝐲 𝐇 𝐌𝐮𝐣𝐇𝐞 𝐁𝐨𝐋𝐨 𝐊𝐲𝐀 𝐁𝐨𝐥𝐍𝐚 𝐇?🤨", "𝐊𝐲𝐀 𝐇𝐮𝐚 𝐦𝐞𝐫𝐢 𝐣𝐚𝐚𝐧  𝐊𝐨 𝐐 𝐁𝐨𝐋𝐚 𝐑𝐞𝐡 𝐇𝐨 𝐬𝐚𝐥𝐞 𝐭𝐮𝐦 𝐬𝐚𝐛 𝐤𝐢 𝐢𝐝 𝐮𝐝𝐚 𝐝𝐮𝐧𝐠𝐚?🤨", "𝐖𝐨 𝐒𝐡𝐘𝐚𝐃 𝐁𝐮𝐒𝐲 𝐇𝐨𝐆𝐞🤨", "𝐁𝐨 𝐁𝐮𝐒𝐲 𝐇𝐚𝐢 𝐀𝐛𝐇𝐢 𝐀𝐩𝐍𝐞 𝐖𝐨𝐑𝐤 𝐌𝐚𝐢 𝐌𝐮𝐣𝐇𝐞 𝐁𝐨𝐋 𝐃𝐨 𝐌𝐚𝐢 𝐁𝐨𝐋 𝐃𝐮𝐧𝐆𝐢 𝐁𝐨𝐬𝐒 𝐊𝐨 🤨", "𝐁𝐨𝐬𝐬 𝐊𝐨 𝐊𝐲𝐮 𝐁𝐮𝐥𝐚 𝐑𝐚𝐡𝐞 𝐇𝐨 𝐏𝐚𝐠𝐚𝐥 𝐇𝐨 𝐊𝐲𝐚😏"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }
