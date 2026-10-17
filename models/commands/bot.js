
/**
 * AHMAD RDX — PREMIUM AUTO REPLY
 * Original Credits: MR SHAAN
 */

const moment = require("moment-timezone");

module.exports.config = {
  name: "goibot",
  version: "3.1.0",
  hasPermssion: 0,
  credits: "MR SHAAN",
  description: "AHMAD RDX premium funny auto-reply",
  commandCategory: "Noprefix",
  usages: "Bot",
  cooldowns: 3
};

const jokes = [
  "😂 Single itna hoon ke khuwab mein bhi larki keh deti hai: bhai side ho!",
  "🤣 Career Titanic bana hua hai aur ghar wale poochte hain shaadi kab?",
  "🙈 Crush online aayi, meri kismat offline ho gayi.",
  "💔 Uski DP roz dekhta hoon, lagta hai relationship WiFi se chal raha hai.",
  "😂 Parhai kal se, aur kal har roz aata hai!",
  "😎 Attitude VIP, balance phir bhi zero!",
  "🤣 Online sher, saamne aaye to silent mode!",
  "😂 Meri love story ka title: Network Error.",
  "🙃 Crush ne kaha you're like a brother. Bas phir zindagi khatam!",
  "😂 Gym kal se, biryani aaj se!",
  "😴 Alarm roz bajta hai, lekin meri kamyabi soti rehti hai.",
  "🤣 Shaadi ka shoq hai, pehle koi reply to kar de!",
  "😂 Mere naseeb ka charger bhi loose connection hai.",
  "💀 Meri kismat ka software update pending hai.",
  "🤣 Pyaar andha hota hai, ghar wale 4K mein dekhte hain.",
  "😂 Salary aati hai guest ban kar, bills usay kidnap kar lete hain.",
  "😜 Mujhe ignore mat karo, main khud ko bhi mushkil se bardasht karta hoon.",
  "🤣 Meri personality premium hai, pocket free version hai.",
  "😂 Exam mein dimagh loading, paper ka time over!",
  "🙈 Babu shona chhoro, pehle WiFi ka password batao.",
  "🤣 Main romantic hoon, bas audience available nahi.",
  "😂 Mere plans NASA level ke, execution chai tak limited.",
  "🤣 Zindagi short hai, lekin Monday bohat lamba hai.",
  "😂 Crush ne seen kar diya, ab main bhi duniya ko seen karunga.",
  "🤣 Meri kismat aur mobile battery dono 1% par hain.",
  "😂 Main jogging par nikla tha, samosa dekh kar wapas aa gaya.",
  "😎 Dil king wala, wallet student wala.",
  "🤣 Love at first sight? Mere saath sleep at first lecture hota hai.",
  "😂 Ghar wale kehte hain phone chhoro, phone kehta hai mujhe mat chhoro.",
  "🤣 Itna single hoon ke wedding card par bhi naam nahi aata.",
  "😂 Main diet par hoon; sirf biryani, pizza aur mithai allowed hain.",
  "💔 Usne kaha change ho jao, main ne DP change kar li.",
  "🤣 Meri life mein suspense zyada, success kam hai.",
  "😂 Itna busy hoon ke khud ko reply dena bhool jata hoon.",
  "🙈 Single log udaas na hon, couples ka recharge bhi khatam hota hai.",
  "😂 Ammi kehti hain kuch ban jao, main kehta hoon chai bana doon?",
  "🤣 Dost kehta hai setting karwa doon, phir apni hi setting nahi hoti.",
  "😂 Mera future bright hai, bas bijli ka bill pending hai.",
  "🤣 Meri salary itni jaldi khatam hoti hai ke bank bhi miss karta hai.",
  "😂 Main handsome nahi, camera mujh se darta hai.",
  "🤣 Doston ka udhaar aur meri tension kabhi khatam nahi hoti.",
  "😂 Meri life ka password bhi mujhe yaad nahi.",
  "😎 AHMAD RDX ka bot hoon, jokes bhi royal marta hoon.",
  "🤣 Crush ko message likha, phir khud hi sharma kar delete kar diya.",
  "😂 Phone 100% charged, lekin meri energy 2% par hai.",
  "🤣 Itni izzat ghar mein nahi milti jitni phone ko milti hai.",
  "😂 Meri kismat buffering par hai, thora wait karo.",
  "🤣 Paisa aur sukoon dono mujhe block kar chuke hain.",
  "😂 Main mature ho gaya hoon, ab ro kar status lagata hoon.",
  "😜 Zindagi mein ek hi goal: tension kam aur biryani zyada!"
];

const replies = {
  "hi": "👋 Assalamualaikum ji! Kya haal hain? 💖",
  "hello": "🌸 Hello ji! Aaj kis ki taang kheenchni hai? 😂",
  "salam": "🌙 Wa Alaikum Assalam wa Rahmatullah ❤️",
  "assalamualaikum": "🌙 Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh ❤️",
  "السلام عليكم": "🌙 وعليكم السلام ورحمة الله وبركاته",
  "thanks": "🥰 Bas bas, itni tareef se bot sharma jayega!",
  "thank you": "✨ Welcome ji! Khush raho.",
  "bye": "👋 Allah Hafiz! Wapas aana, attendance lagegi 😂",
  "good night": "🌙 Good night! Khuwabon mein WiFi full signals ho 😂",
  "gn": "🌙 Sweet dreams! Crush reply kare, Ameen 😂",
  "good morning": "☀️ Good morning! Utho ji, duniya aage nikal rahi hai!",
  "morning": "☀️ Morning ji! Chai ho jaye? ☕",
  "owner": "╭━━〔 👑 OWNER 〕━━╮\n\n✨ AHMAD RDX\n📱 WhatsApp: +92306*******\n✈️ Telegram: ahmadalisafdar3\n🔗 Facebook: facebook.com/profile.php?id=100016828397863\n\n╰━━〔 AHMAD RDX 〕━━╯",
  "bot ka malik": "👑 Mera creator AHMAD RDX hai! Premium bot, premium owner 😎",
  "shaan": "😎 Original credits: MR SHAAN | Branding: AHMAD RDX",
  "janu": "🙈 Janu sirf kehne se nahi banta, pehle chai pilao 😂",
  "jan": "🌸 Ji janu, farmayein. Drama free service available!",
  "hug": "🫂 Virtual hug accepted! Ab biryani bhi bhej do 😂",
  "hug me": "🫂 Lo ji hug! Ab emotional damage band karo 😂",
  "funny": "😂 Joke: Meri salary itni jaldi khatam hoti hai ke bank bhi kehta hai, dobara kab aaoge?",
  "hate you": "🥺 Itna bhi bura nahi hoon, charger bhi share kar leta hoon!",
  "busy": "😎 Busy hoon ji, imaginary girlfriend se baat chal rahi hai!",
  "wow": "✨ Wow aap bhi! Compliments ka bill baad mein bhejunga 😂",
  "delete": "😂 Pehle message bheja, ab delete? Yeh kaisa relationship hai!",
  "tharki": "🙄 Main masoom bot hoon, ilzaam lagane se pehle saboot lao 😂",
  "koi hai": "🙋 Main hoon na! Server room mein akela baitha hoon 😂",
  "acha": "🌸 Achaaa ji! Baat mein twist lag raha hai 😂",
  "acha ji": "🙈 Han ji, aur sunao!",
  "shadi karoge": "😂 Pehle rishta developer AHMAD RDX ko bhejo!",
  "mujhse shadi karoge": "💍 Pehle system requirements match karwa lo 😂",
  "stop": "🤐 Theek hai, chup mode ka drama shuru!",
  "chup": "🤫 Okay ji, premium silence activated!",
  "i love you": "❤️ Aww! Bot ko pyaar? AHMAD RDX ne kamaal kar diya 😂",
  "love you": "💖 Love received! Ab bot ko update bhi karwa dena 😂",
  "i miss you": "🥹 Main yahin hoon! Server se door nahi gaya.",
  "miss u": "🌸 Aww, online hi hoon ji!",
  "kaise ho": "😎 Main fit hoon, bas RAM ko thora pyaar chahiye!",
  "kese ho": "✨ Main zabardast! Aap sunao ji?",
  "ladki ho": "🤖 Main bot hoon ji, meri gender settings pending hain!",
  "inbox aa": "😂 Group mein baat karo ji, inbox ka traffic bohat hai!",
  "mar ja": "🥺 Aisi baat na karo ji, joke maaro aur khush raho.",
  "kill you": "🤖 Pehle mujhe uninstall to kar ke dikhao 😂",
  "ganda": "😂 Aapki soch ka antivirus update chahiye!",
  "ganda bot": "😎 Premium bot hoon, jokes thore dusty hain!",
  "tera malik kon hai": "👑 AHMAD RDX — mera creator aur boss!",
  "is bot ka malik kon hai": "👑 AHMAD RDX — Powered by AHMAD RDX!"
};

module.exports.handleEvent = async function({ api, event, Users }) {
  try {
    if (!event.body || event.senderID === api.getCurrentUserID()) return;

    const body = event.body.trim();
    const text = body.toLowerCase().replace(/\s+/g, " ");
    const threadID = event.threadID;
    const messageID = event.messageID;

    const send = msg =>
      api.sendMessage(msg, threadID, undefined, messageID);

    if (replies[text]) return send(replies[text]);

    if (/\b(kamina|sala|saala)\b/i.test(text)) {
      return send("🙄 Zubaan control ji! AHMAD RDX ko complaint kar doon? 😂");
    }

    if (/\b(bot|ahmad rdx)\b/i.test(body)) {
      let name = "Dost";
      try {
        if (Users) name = await Users.getNameUser(event.senderID) || name;
      } catch (_) {}

      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      const time = moment.tz("Asia/Karachi").format("hh:mm A");

      return send(
`╭━━━〔 👑 AHMAD RDX 〕━━━╮

✨ Assalamualaikum, ${name}!
💬 Tum ne mujhe yaad kiya?

━━━━━━━━━━━━━━━━━━
😂 ${joke}
━━━━━━━━━━━━━━━━━━

💎 PREMIUM FUN BOT
🕒 ${time}
👑 POWERED BY AHMAD RDX

╰━━━━━━━━━━━━━━━━━━━━╯`
      );
    }
  } catch (err) {
    console.error("[AHMAD RDX ERROR]", err);
  }
};

module.exports.run = function({ api, event }) {
  return api.sendMessage(
`╭━━━〔 👑 AHMAD RDX 〕━━━╮

✅ PREMIUM AUTO REPLY ACTIVE
😂 Funny replies ready!
💬 Message mein "Bot" likh kar bulao.

━━━━━━━━━━━━━━━━━━
✨ Stylish • Funny • Premium
👑 POWERED BY AHMAD RDX
╰━━━━━━━━━━━━━━━━━━━━╯`,
    event.threadID,
    undefined,
    event.messageID
  );
};
