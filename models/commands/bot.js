
/**
 * GOIBOT PREMIUM EDITION
 * Developer: AHMAD RDX
 * Original Credits: MR SHAAN
 */

const moment = require("moment-timezone");

module.exports.config = {
  name: "goibot",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "MR SHAAN",
  description: "Premium funny no-prefix auto replies",
  commandCategory: "Noprefix",
  usages: "Bot + message",
  cooldowns: 3
};

const jokes = [
  "😂 Single itna hoon ke khuwab mein bhi larki keh deti hai: bhai side ho!",
  "🤣 Career Titanic bana hua hai, aur ghar wale poochte hain shaadi kab?",
  "🙈 Crush online aayi, meri kismat offline ho gayi.",
  "💔 Uski DP roz dekhta hoon, lagta hai relationship WiFi se chal raha hai.",
  "😂 Parhai kal se, aur kal har roz aata hai!",
  "🤣 Mera dil bohat bara hai, bas jeb chhoti hai.",
  "😎 Attitude apna VIP, balance phir bhi zero!",
  "😂 Ammi kehti hain kuch ban jao, main kehta hoon chai bana doon?",
  "💀 Itna single hoon ke wedding card par bhi mera naam nahi aata.",
  "🤣 Online sher, saamne aaye to silent mode!",
  "😂 Meri love story ka title: Network Error.",
  "🙃 Crush ne kaha you're like a brother. Bas phir zindagi khatam!",
  "🤣 Paisa hota to tension nahi hoti, paisa hi nahi to tension kis baat ki?",
  "😂 Gym kal se, biryani aaj se!",
  "😴 Alarm roz bajta hai, lekin meri kamyabi soti rehti hai.",
  "💔 Loyal dhoondte dhoondte khud hi cartoon ban gaya.",
  "🤣 Shaadi ka shoq hai, pehle koi reply to kar de!",
  "😂 Mere naseeb ka charger bhi loose connection hai.",
  "😎 Main handsome nahi, bas camera mujh se darta hai.",
  "🤣 Zindagi mein do maslay: paisa nahi, aur paisay walon ka attitude!",
  "😂 Crush ka reply: hmm. Meri umeedein: khatam!",
  "🙈 Itna shareef hoon ke jhoot bolte hue bhi sach bol deta hoon.",
  "🤣 Doston ka udhaar aur meri tension kabhi khatam nahi hoti.",
  "😂 Main jogging par nikla tha, samosa dekh kar wapas aa gaya.",
  "💀 Meri kismat ka software update pending hai.",
  "🤣 Pyaar andha hota hai, lekin ghar wale 4K mein dekhte hain.",
  "😂 Salary aati hai guest ban kar, bills usay kidnap kar lete hain.",
  "😜 Mujhe ignore mat karo, main khud ko bhi mushkil se bardasht karta hoon.",
  "🤣 Meri personality premium hai, bas pocket free version hai.",
  "😂 Exam mein dimagh loading, paper ka time over!",
  "🙈 Babu shona chhoro, pehle batao WiFi ka password kya hai?",
  "🤣 Main bohat romantic hoon, bas audience available nahi.",
  "😂 Mere plans NASA level ke hain, execution chai tak limited hai.",
  "😎 AHMAD RDX ka bot hoon, jokes bhi royal marta hoon!",
  "🤣 Zindagi short hai, lekin Monday bohat lamba hai.",
  "😂 Crush ne seen kar diya, ab main bhi duniya ko seen karunga.",
  "🙃 Ghar wale kehte hain phone chhoro, phone kehta hai mujhe mat chhoro.",
  "🤣 Itni mehnat se online aata hoon, koi poochta bhi nahi kahan thay!",
  "😂 Mera future bright hai, bas bijli ka bill pending hai.",
  "😜 Mujhe attitude nahi, bas neend poori nahi hoti.",
  "🤣 Dost kehta hai setting karwa doon, phir apni hi setting nahi hoti.",
  "😂 Main diet par hoon; sirf biryani, pizza aur mithai allowed hain.",
  "💔 Usne kaha change ho jao, main ne DP change kar li.",
  "🤣 Meri life mein suspense zyada, success kam hai.",
  "😂 Itna busy hoon ke khud ko reply dena bhi bhool jata hoon.",
  "😎 Dil king wala, wallet student wala.",
  "🤣 Love at first sight? Mere saath to sleep at first lecture hota hai.",
  "😂 Ammi ki nazar mein main mobile ka permanent employee hoon.",
  "🙈 Single log udaas na hon, couple logon ka recharge bhi khatam hota hai.",
  "🤣 Meri kismat aur mobile battery dono 1% par hain.",
  "😂 Aaj ka mission: kaam kam, snacks zyada!"
];

const replies = {
  "hi": "👋 Hello ji! Assalamualaikum bolo, sawab bhi milega aur style bhi! 💖",
  "hello": "🌸 Hello hello! Kya haal hain, VIP guest?",
  "salam": "🌙 Wa Alaikum Assalam wa Rahmatullah ❤️",
  "assalamualaikum": "🌙 Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh ❤️",
  "السلام عليكم": "🌙 وعليكم السلام ورحمة الله وبركاته",
  "thanks": "🥰 Bas bas, itni tareef se bot sharma jayega!",
  "thank you": "✨ Welcome ji! Dua mein yaad rakhna.",
  "bye": "👋 Allah Hafiz! Wapas aana, warna bot attendance lagayega 😂",
  "good night": "🌙 Good night! Khuwabon mein bhi WiFi full signals ho 😂",
  "gn": "🌙 Sweet dreams! Crush reply kare, Ameen 😂",
  "good morning": "☀️ Good morning! Utho ji, duniya aage nikal rahi hai!",
  "morning": "☀️ Morning ji! Chai ho jaye? ☕",
  "owner": "👑 BOT OWNER\n\n✨ AHMAD RDX\n📱 WhatsApp: +92306*******\n✈️ Telegram: ahmadalisafdar3\n🔗 Facebook: facebook.com/profile.php?id=100016828397863",
  "bot ka malik": "👑 Mera creator AHMAD RDX hai! Premium bot, premium owner 😎",
  "shaan": "😂 MR SHAAN credits mein hain, lekin AHMAD RDX branding bhi yaad rakhna!",
  "janu": "🙈 Janu sirf kehne se nahi banta, pehle chai pilao 😂",
  "jan": "🌸 Ji janu, farmayein. Drama free service available hai!",
  "hug": "🫂 Virtual hug accepted! Ab biryani bhi bhej do 😂",
  "hug me": "🫂 Lo ji hug! Ab emotional damage band karo 😂",
  "funny": "😂 Joke suno: meri salary itni jaldi khatam hoti hai ke bank bhi kehta hai dobara kab aaoge?",
  "songs": "🎶 Dil toota hai, lekin Bluetooth abhi connected hai 😂",
  "hate you": "🥺 Itna bhi bura nahi hoon, charger bhi share kar leta hoon!",
  "busy": "😎 Busy hoon ji, apni imaginary girlfriend se baat chal rahi hai!",
  "wow": "✨ Wow aap bhi! Compliments ka bill baad mein bhejunga 😂",
  "delete": "😂 Pehle message bheja, ab delete? Yeh kaisa relationship hai!",
  "logo": "🎨 Logo commands ke liye apne bot ke available logo commands check karein.",
  "logos": "🎨 Logo commands ke liye apne bot ke available logo commands check karein.",
  "tharki": "🙄 Main masoom bot hoon, ilzaam lagane se pehle saboot lao 😂",
  "tharki bot": "😇 Main to seedha saadha code hoon, shararat user karta hai!",
  "koi hai": "🙋 Main hoon na! Server room mein akela baitha hoon 😂",
  "acha": "🌸 Achaaa ji! Baat mein twist lag raha hai 😂",
  "acha ji": "🙈 Han ji, aur sunao!",
  "by": "👋 Allah Hafiz ji, khayal rakhna!",
  "shadi karoge": "😂 Pehle rishta bot ke developer AHMAD RDX ko bhejo!",
  "mujhse shadi karoge": "💍 Pehle system requirements match karwa lo 😂",
  "stop": "🤐 Theek hai, chup mode ka drama shuru!",
  "chup": "🤫 Okay ji, ab sirf premium silence!",
  "i love you": "❤️ Aww! Bot ko pyaar? AHMAD RDX ne kamaal kar diya 😂",
  "love you": "💖 Love received! Ab bot ko update bhi karwa dena 😂",
  "i miss you": "🥹 Main yahin hoon! Server se door nahi gaya.",
  "miss u": "🌸 Aww, online hi hoon ji!",
  "kaise ho": "😎 Main fit hoon, bas RAM ko thora pyaar chahiye!",
  "kese ho": "✨ Main zabardast! Aap sunao ji?",
  "ladki ho": "🤖 Main bot hoon ji, meri gender settings abhi pending hain!",
  "inbox aa": "😂 Group mein baat karo ji, inbox ka traffic bohat hai!",
  "ib aa": "🙈 Yahin bolo, group bhi family hai 😂",
  "mar ja": "🥺 Aisi baat na karo ji, joke maaro aur khush raho.",
  "kill you": "🤖 Pehle mujhe uninstall to kar ke dikhao 😂",
  "ganda": "😂 Aapki soch ka antivirus update chahiye!",
  "ganda bot": "😎 Premium bot hoon, bas jokes thore dusty hain!"
};

module.exports.handleEvent = async function({
  api, event, Users
}) {
  try {
    if (!event.body || event.senderID === api.getCurrentUserID()) return;

    const body = event.body.trim();
    const text = body.toLowerCase().replace(/\s+/g, " ");
    const threadID = event.threadID;
    const messageID = event.messageID;

    // Exact keyword triggers
    if (replies[text]) {
      return api.sendMessage(
        replies[text],
        threadID,
        undefined,
        messageID
      );
    }

    // Additional keyword matching
    if (/\b(kamina|sala|saala)\b/i.test(text)) {
      return api.sendMessage(
        "🙄 Zubaan control ji! AHMAD RDX ko complaint kar doon? 😂",
        threadID,
        undefined,
        messageID
      );
    }

    if (/\b(bot|goibot)\b/i.test(body)) {
      const name = Users
        ? await Users.getNameUser(event.senderID).catch(() => "Dost")
        : "Dost";

      const reply = jokes[Math.floor(Math.random() * jokes.length)];
      const time = moment.tz("Asia/Karachi").format("hh:mm A");

      const msg =
`╭━━━〔 ✦ GOIBOT PREMIUM ✦ 〕━━━╮
 
  ✨ Hey, ${name}!
  💬 Tum ne bot ko yaad kiya?

  ─────────────────
  ${reply}
  ─────────────────

  👑 AHMAD RDX
  🕒 ${time}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

      return api.sendMessage(msg, threadID, undefined, messageID);
    }
  } catch (err) {
    console.error("[GOIBOT ERROR]", err);
  }
};

module.exports.run = function({ api, event }) {
  return api.sendMessage(
    "╭━━〔 ✦ AHMAD PREMIUM ✦ 〕━━╮\n\n" +
    "🤖 Main active hoon!\n" +
    "💬 Mujhe message mein 'Bot' keh kar bulao.\n\n" +
    "👑 AHMAD RDX\n" +
    "╰━━━━━━━━━━━━━━━━━━━━╯",
    event.threadID,
    undefined,
    event.messageID
  );
};
