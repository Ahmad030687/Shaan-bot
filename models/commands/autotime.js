
const AYAT = [
  ["إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Beshak mushkil ke saath aasani hai.", "Ash-Sharh 94:6"],
  ["فَاذْكُرُونِي أَذْكُرْكُمْ", "Tum Mujhe yaad karo, Main tumhein yaad karunga.", "Al-Baqarah 2:152"],
  ["إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", "Beshak Allah sabr karne walon ke saath hai.", "Al-Baqarah 2:153"],
  ["لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", "Gham na karo, Allah hamare saath hai.", "At-Tawbah 9:40"],
  ["وَاللَّهُ خَيْرُ الرَّازِقِينَ", "Allah sab se behtar rizq dene wala hai.", "Al-Jumu'ah 62:11"],
  ["إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", "Beshak Allah har cheez par qadir hai.", "Al-Baqarah 2:20"],
  ["وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ", "Tum jahan bhi ho, Woh tumhare saath hai.", "Al-Hadid 57:4"],
  ["إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", "Allah neki karne walon se muhabbat karta hai.", "Al-Baqarah 2:195"],
  ["ادْعُونِي أَسْتَجِبْ لَكُمْ", "Mujh se dua karo, Main tumhari dua qabool karunga.", "Ghafir 40:60"],
  ["وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", "Meri taufeeq sirf Allah ki madad se hai.", "Hud 11:88"],
  ["إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", "Beshak Allah bakhshne wala, meherban hai.", "Al-Baqarah 2:173"],
  ["فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", "Pas yaqeenan mushkil ke saath aasani hai.", "Ash-Sharh 94:5"],
  ["وَقُلْ رَبِّ زِدْنِي عِلْمًا", "Aur kaho: Ae mere Rab, mere ilm mein izafa farma.", "Ta-Ha 20:114"],
  ["إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ", "Allah tauba karne walon se muhabbat karta hai.", "Al-Baqarah 2:222"],
  ["وَلَا تَيْأَسُوا مِنْ رَوْحِ اللَّهِ", "Allah ki rehmat se mayoos na ho.", "Yusuf 12:87"],
  ["حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", "Allah hamare liye kaafi hai, Woh behtareen kaarsaaz hai.", "Aal-e-Imran 3:173"],
  ["إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ", "Beshak mera Rab qareeb aur dua qabool karne wala hai.", "Hud 11:61"],
  ["وَاللَّهُ يُحِبُّ الصَّابِرِينَ", "Allah sabr karne walon se muhabbat karta hai.", "Aal-e-Imran 3:146"],
  ["إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ", "Beshak Allah ki rehmat qareeb hai.", "Al-A'raf 7:56"],
  ["وَإِلَى اللَّهِ تُرْجَعُ الْأُمُورُ", "Aur tamam mamlaat Allah hi ki taraf lautaye jate hain.", "Al-Baqarah 2:210"],
  ["رَبِّ اشْرَحْ لِي صَدْرِي", "Ae mere Rab, mera seena khol de.", "Ta-Ha 20:25"],
  ["إِنَّ اللَّهَ مَعَنَا", "Beshak Allah hamare saath hai.", "At-Tawbah 9:40"],
  ["وَهُوَ أَرْحَمُ الرَّاحِمِينَ", "Aur Woh sab meherbanon se zyada meherban hai.", "Yusuf 12:64"],
  ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "Sab tareef Allah ke liye hai jo tamam jahanon ka Rab hai.", "Al-Fatihah 1:2"]
];

module.exports.config = {
  name: "autosent",
  version: "12.0",
  permission: 0,
  credits: "SHAAN-KHAN | AHMAD RDX",
  description: "Hourly Quran Ayat",
  commandCategory: "group messenger",
  cooldowns: 3
};

const formatTime = () => new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Karachi",
  hour: "numeric",
  hour12: true
}).format(new Date());

function sendAyat(api, threadID, hour) {
  const a = AYAT[hour];
  const msg = `🌙 ═══ QURAN REMINDER ═══ 🌙

📖 ${a[0]}

✨ Tarjuma:
${a[1]}

📚 Reference: ${a[2]}
🕒 Pakistan Time: ${formatTime()}

💎 POWERED BY AHMAD RDX`;

  api.sendMessage(msg, threadID);
}

module.exports.onLoad = ({ api }) => {
  if (global.autosentTimer) clearInterval(global.autosentTimer);
  global.autosentEnabled ??= true;
  global.autosentLastHour ??= "";

  global.autosentTimer = setInterval(() => {
    if (!global.autosentEnabled) return;

    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).format(now);

    if (!parts.endsWith(":00") || global.autosentLastHour === parts) return;
    global.autosentLastHour = parts;

    const hour = Number(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      hourCycle: "h23"
    }).format(now));

    for (const id of global.data?.allThreadID || []) {
      sendAyat(api, id, hour);
    }
  }, 15000);
};

module.exports.run = ({ api, event, args }) => {
  const action = (args[0] || "status").toLowerCase();

  if (action === "on") global.autosentEnabled = true;
  else if (action === "off") global.autosentEnabled = false;

  return api.sendMessage(
    `🌙 AUTOSENT: ${global.autosentEnabled ? "ON ✅" : "OFF ⛔"}\n.autosent on\n.autosent off`,
    event.threadID
  );
};
