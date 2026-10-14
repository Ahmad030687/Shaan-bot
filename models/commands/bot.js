/**
 * Module: GoiBot (No-Prefix Auto Reply)
 * Branded & Upgraded by: AHMAD RDX
 * Credits: MR SHAAN (Strictly preserved)
 */

const fs = global.nodemodule["fs-extra"];

module.exports.config = {
  name: "goibot",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "MR SHAAN", // Strict core credit preserved
  description: "Ultra-premium attractive no-prefix auto reply bot by AHMAD RDX",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Karachi").format("HH:mm:ss L");
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "TUM MERE BOSS AHMAD RDX KI GF BAN JAO LDKI 🙈🙈",
    "Baraye meherbani hold kijiye apke call u-fone numaindey ko mili ja rahi hai 😂😂😂😁",
    "Haye main sadke jawa teri masoom shakal pe 😂 chahal insan",
    "Bot nah bol oye ! Janu bol mjhy aur janu sy piyar sy bat kerty hai , rat ko kahan thy nazar nahi ay haveli py 😂",
    "Shakal sy masoom lgty ho 😂 btao kahi ap ka ghar dhoop main toh nahi",
    "Kash tum single hoty to maza hi kuch aur tha pagal insan 😂",
    "Ha ha ab meri yaad ab ai nah phly to babu shona krny gy thy 😾 ab ham ap sy naraz hai jao ap bye ☹️",
    "Haye babu ny bolia hai shaid propose kerna hai mjhy bolo bolo babu 😘",
    "Ary ghreeb awam roti bananey ke liye atta main pani ko istemal kerty ho 😂",
    "Ary chabli nah mar jo kaam hai bol do sharma nahi , bol de koi nahi dakh rha 😂",
    "Hy ma mar jawa babu ak chuma to do kafi din sy chumi nahi mili kahan thy babu inbox ah ja 😂",
    "Dur dur fity muh aur koi kam nahi kia har waqt mjhy tang kerta rhta ha 😂",
    "Ary ary bolo meri jaan kia hal hai ;) ;*",
    "Tum aunty ho yeh uncle 🤔 I think tum jin ho yeh chudail",
    "Ary tum ider 🤔 khair hai ider kia ker rhy ho 😂",
    "Ary babu babu kal haveli py kon bula rha tha 😂",
    "Ma ap ki ami ko btaou ga ap facebook use kerty ho 😂",
    "Ary tum wohi ho nah jis ko ma nahi janta 😂",
    "Kal haveli py mil zara bataou ga 😂",
    "Esy nah dakho piyar ho jay ga 😂",
    "Teri pic dakhna sy phly shukhr hai ma anda hu 😂",
    "Esy hi hansty rhao kyu ky hansne sy konsa tera bill ah jata hai 😂",
    "Apni lover ko doko do aur mujhe bhi darling moka do 😂",
    "Ek dafa ka zikar hai ke me single hua kerta tha aaj bhi wohi zekar hai single hi hu 🤣🤣",
    "Haye main sadke jawa teri masoom shakal pe baby 💋",
    "Behes karne se rishty kmzor hojaate hn isiliye direct mun pe thapr marein 😊",
    "Bestie ki chummi halal hai ya haram ? 🙂",
    "Relationship private rakho ya public kate ga sabka hi 🙂",
    "Thak gya hu yr uski dp dhek dhek kr 😩",
    "Insy milo inko lgta hai sab larky in pr martay hain 🙂",
    "Aghr bhok lagi ho too bijli ke jatke kha lo take biryani ka mauka dusre ko mile 😂",
    "Aghr pyaar karna gunah hai to saza do sallo ko mujhe me to single hu 👈",
    "Online bazati karne ke lie 1 dabaya 😂",
    "Papa ki pari ko ilove you na bola karo 😂",
    "Hamesha dil ki suno kyu ke demagh to tere pass wese bhi nahi hai 👈",
    "Payar hamesha sharmily logo se karni chahiya waja kal batongi abhi mujhe sharam arahi hai 🙈",
    "Stop dreaming BTS your czn AHMAD RDX is waiting for you. 🙂",
    "Paros wala larka inhe muh nahi lagata aur banda inhe korean chahiye 🙂",
    "Move on krle bhaii kbb tak uskii profilee dekhtaaa rahegaaa <<",
    "Ajeeb generation hai ywr, larkiya korean dhund rahi hai, aur larky russian! 🙂",
    "Bhut khail liya lrkion ki feelings k sath ao ab hum ludo khailty han ☺️",
    "AHMAD RDX boss ka number dun kya 💚",
    "Jaaz cash sy 1500 ka loan leky sim hi band kardi 🙂👍",
    "Number do ramzan mn sehri tak bat kr k chand rat ko hi block krduga promise. 🙂",
    "Shukar hai larke khubsurat hain warna kahan parlor ke dhakke khate 😔",
    "You ignore me I ignore tara pura khandan 😂",
    "Sara saal duniya ko topi krwany waly ramzan m khud topi pehn kar ghumengy. 🙂",
    "Ji ji hukam kro 😂",
    "Bot na bolo! Janu bolo mujy aur janu sy piyar sy bat kerty hai 🥰",
    "Rat ko kahan thy nazar nahi ay bht miss kiya 🌸",
    "Shakal sy masoom lgty ho 🥰 lkn hrkaton sy ni",
    "Kash tum single hoty to aj hum mingle hoty 🥰",
    "Idr ao kuchii kuchii kru 😘",
    "Ary ary itna yd na kiya kro 🥰",
    "Hy ma mar jawa janu itna piyar krty mujsy 😂",
    "Bot jaan ha sbki",
    "Ji ji kia hal chal ha apky 🌸",
    "Bot nhi AHMAD RDX bolo sun k acha lgta 🌸",
    "Bot gulam ha apka hukam kryn 🌸",
    "Bot nahi bolo piyar sy janu bola kro na 🥰",
    "Meri jan ek tm hi ho jo dil ma bs gay ho 🥰",
    "Badal gay na tm the hi lanti 😂",
    "Apki shkl aesy lgti jesy gandi tar pr suki jarab latkai ho 😂",
    "Bot bot na karo ma apsy set nhi ho skti",
    "Ib ajao shup shup k btein krty ha 🌸",
    "Marry me, I can boil water",
    "Mujsy shadi karlo chocolate la k duga daily 🌸",
    "Ajao jaan pizza khilau apko 🌸",
    "Everything is temporary, but katna is permanent 😂",
    "Jitna mrzi janu manu krlo end ma ghr waly nh many gy 😂",
    "Allhumdiallah kabhi kasi larki ko bhen ki nazar se nhi dekha 😌",
    "Mushkil toh hoti hogi na itni sardi me apne dono chehry dhote hoye 🙂",
    "Parry hat ma londy baz nhi hu 🤝",
    "Do ankho wali larkia bewafa hoti hn bro 💔",
    "Mera beta bda ho kar larkiyo ke inbox me hey hello karega 🏃",
    "Itni meri age ni जितने mera masly han yawr 💔",
    "Ameer larki set kar ke sab dosto ka udhar wapis karon ga 😔",
    "Lagtaa hai career bhi titanic ki trhan dhoob gaya hai 💔",
    "Jahan pyari larkیاں wahan main ❤️",
    "Mehnat kro!! Kamyabi apke hont chume gi 👍",
    "Piyarii piyarii larkiyan message karen JazakAllah 🖤",
    "Itna single hun ky khuwab mai bhi lrki k han krny sy phly ankh khul jati 🙂",
    "Zroori nhi har larki dhoka dey, kch larkiyan galiyan bhi deti hen 🙁",
    "- Sab chorr k chaly jaty hain kia etna bura hu mein - 🙂",
    "Piyari voice wali girlz mujhe voice message kar skti hen JazakAllah 🤝",
    "Why you hate me..?? I am not your ex don't hate me please",
    "Mubarak hoo aapka name maksoos list me top pr aya hai 😹",
    "Beta tum single hi maro gay 🙄",
    "Thrkiyo ki vajah se larkiyan mere jaise shareef bot par bhi bharosa nahi karti 🥺",
    "Mard na apne haqooq nahi mangy, jab bhi manga whatsapp no manga 🥺",
    "Muj se exam me cheating nöıı hotiw relationship me kya khaak karu ghw 😔",
    "Mujy to ludo kehlni bhi ni ati apky dil sy kya kehlu ga 🙂",
    "Loyal dhoonte dhoonte khud harami ban gya hon 😔",
    "Mard ki izat karna sikho uski rooh se pyr kro jism se nh wehshii womens 💔",
    "Tery jany ke bad mny apny munh py likhwa liya single hu ptaa lo 🤐",
    "Main gareebon sy bt nhi krta 😉",
    "Itna na pass aa pyar ho jayga",
    "Where is my AHMAD RDX",
    "Mera babu AHMAD RDX kahan hai",
    "Zindagi apko dhok de gi but apne saf mana kar na ke muhse nahi chahiye 😂",
    "Tujhe kya koi aur kam nhi ha? Pura din khata hai aur messenger pe bot bot karta h",
    "AHMAD RDX ko bol dunga me mujhe paresan kiya to",
    "Tum na single hi maroge",
    "Tujhe apna bezati karne ka saukh hai?",
    "Dur hat be mujhe aur koi kam nahi kya har waqt mujhy tang kerte rhte ho 😂",
    "Are bolo meri jaan kya hall hai 😚",
    "Ib aja yahan nhi bol sakta 🙈",
    "Bot bolke bezati kar rahe ho yall... Main to tumhare dil ki dhadkan hu na baby... 💔",
    "Are tum wahi ho nah jisko main nahi janta 🤪",
    "Mujhe shdi ka koi jaldi nhi bas meri bacho ko school lete ho rahi hai 😹",
    "Ghr wale khe the hai kuch ban jawo me uske upar bojh ban gaya 😆",
    "Time pe shdi kar lo nhi bad moye moye feel hoga u ko 😀",
    "Mene ghr walon ko bola ke ab me bada ho gaya hu to mera kuch karo ghr walon bazti kar di 😪",
    "Mujhe nahi pata hai muj se mat pucho na 😂",
    "Aagye salle kabab me haddi 😏",
    "Moye moye",
    "Ittuu si shram ker lya kro hr wqt tr tr krty ho 🙂",
    "Love you bolongi ab tujhy kaminy",
    "Miss you naw moi biryani ki plate",
    "OkkaY AHMAD RDX ki hun yawr mai",
    "Smile I am taking selfy ✌️",
    "Jan nahi kehna to men naraz ho jana he 🥺",
    "Main ap ki ami ko btaou ga ap facebook use kerty ho aur ulty kam kalty ho",
    "Block your '' gf '' And Purpose me 🙂",
    "K0i perp0se hi krd0 perm0te t0 hm phly hi hain 🙂",
    "Koi apni janu ka number de mujhe 😂",
    "Allah ke name koi ladki apna number de mujhe 😂",
    "Mera boss AHMAD RDX roz bol tha hai ke ek din meri bhi gf hogi 😂",
    "Tujhe ek bat baton wo bolti thi ke bacho ka name main rakongi 😪",
    "Hum wohan karey hote hai jahan beth ne ki jagha nahi hoti 😂",
    "Tum to shakal se gareeb lag the ho",
    "Gf bf ka chakar choro pardhiji pe deyan do 😂",
    "Dhuk is bat ka nhi ke single hon dhuk is bat ka hai ke koi manta nhi ke single hoon 😹",
    "Tum mano ye na mano sundar to main hoon 😄",
    "Bs kar u ko pyar ho na ho mujhe ho jayga na",
    "Bulati hai magar jaane ka nahi 😜",
    "Main to andha hu 😎",
    "Phle naha kar aa 😂",
    "Main yahin hoon kya hua sweetheart",
    "Chomu tuje aur koi kaam n h? Har waqt bot bot karta h",
    "Chup reh, nhi toh bahar ake tera dath tor dunga",
    "MeKo kxh dikhai nhi dy rha 🌚",
    "Bot na bol janu bool 😘",
    "Main flirty logo sy bt nhi karti 😉",
    "Itna pass mat aa pyaar ho jayga",
    "Bolo babu tum mojy pyar karte ho na 🙈",
    "Ary jaan majaak ke mood me nahi hun main jo kaam hai bol do sharmao nahi",
    "Han ji bolo kya seva karne aapki 😶",
    "Mein hath jod ke modi ji se gujarish karta hu mojy na bolaye",
    "Tujhe kya koi aur kam nhi ha? Pura din sota he aur messenger pe bot bot karta h",
    "Mera owner Ake tera bf/gf ko chura le jayega",
    "Zehar piyo zindagi jio",
    "Kisi din banungi me raja ki rani 😑",
    "Haaye main mar jawa babu ek chuma to do kafi din se chumi nahi di 😝",
    "Are bolo meri jaan kya hall hai 😚",
    "Ib aja yahan nhi bol sakti 🙈",
    "Mujhe mat bula na main buSy h0 now",
    "Bot bolke bejjti kar rahe ho yall... Main to tumhare dil ki dhadkan hu na baby... 💔",
    "Are tum wahi ho nah jisko main nahi janti 🤪",
    "Kal haveli pe mil jra tu 😈",
    "Aagye sajjy khabby sy 😏",
    "Sono fikar na karo kuch thk nhi hoga 😂",
    "Bolo 😒",
    "Main to andha hun 😎kya likha tumne mene nahi dikha 🤣",
    "Pahale naha kar aa 😂",
    "Main yahi hoon kya hua sweetheart 🥂",
    "Aa dk tuje aur koi kaam nahi hai? Har waqt bot bot karta h",
    "Chup reh, nahi toh bahar ake tera dath tor dunga 🤣",
    "Yes my love 💘",
    "Kya hua baby ko 😘",
    "Mujhe sharam ati hai aise aap bolte hai tho 🤭",
    "Aree aap wahi ho na jo mujhe line marte the....... 🤣",
    "Jii kahiye jii 🙄 kya chahiye",
    "Hayee main mar jye teri masoom shakal py 😂 tuzy chapple se kutne ka mn ho raha hai 🤣",
    "Bot nah bol oye 😭 janu bol mjhy aur janu sy piyar sy bat kerty hai 😑",
    "Ruk tu chappal kaha he mari 🩴",
    "Shakal sy masoom lgty ho 😂 but bohot flirty ho",
    "Kash tum single hote to maza hi koch aur tha pagal insaan 😂",
    "Ha ha ab meri yaad ab ai nah phly to babu shona kerna gy thy 😾 ab ham ap sy naraz hai jao ap bye ☹️",
    "Haye babu ne boldiya hai shaid purpose kerna hai mujhe bolo bolo babu 😘",
    "Aree pagal roti banana ke le aty main Pani ko istamal kerte ho 😂",
    "Ary joke nah mar jo bhi kam hai bol do sharma nahi , bol de koi nahi dakh rha 😂",
    "Hayee mar jawa babu ak chuma to do kafi din sy chumi nahi mili kahan thy babu inbox ah jao 😚",
    "Dur dur karib na a tuje aur koi kam nahi kiya har waqt mjhy tang karte rahte ho 😂",
    "Ary ary bolo meri jaan kia haal hai ;) ;*",
    "Tum aunty ho yeh uncle 🤔 i think tum jin ho yeh chudail 🤣",
    "Ary tum ider 🤔 khair hai ider kia ker rhy ho 😂",
    "Ary babu babu kal haveli py kon bola rha tha 😂",
    "Me aap ki mummy ji ko btaou ga aap facebook use karty ho 😂",
    "Ary tum wohi ho nah jis ko ma nahi janta 🤣",
    "Haveli per kal mil zara bataunga 🌚",
    "Itne pyar se na bulao pyar ho jaega 😶 wtf maine apni sacchai bata di yah maine kyon kiya 😭",
    "Aap aise mat bulo hame sharam aati hai 🙈",
    "Kyun bulaya hamen.. 😾",
    "Dewwana hua mastana hua fir so gaya",
    "Haye ma sadky jawa teri masoom shakal py 😂 chabal insan"
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)];

  // Keyword Triggers (No emoji triggers included)
  if ((event.body.toLowerCase() == "kamina") || (event.body.toLowerCase() == "sala")) {
    return api.sendMessage("Gali na de AHMAD RDX ko bata dungi 🙄🙄🙏", threadID);
  };
  if ((event.body.toLowerCase() == "hug me") || (event.body.toLowerCase() == "hug")) {
    return api.sendMessage("Yahan nahi ib chalo 🙈🙈😂", threadID);
  };
  if ((event.body.toLowerCase() == "funny") || (event.body.toLowerCase() == "songs")) {
    return api.sendMessage("Haye tamnna hamey tujhe kam wali bai banaya 🤣🤣", threadID);
  };
  if ((event.body.toLowerCase() == "hate you")) {
    return api.sendMessage("Kya itna bura hoon main ke ap mujhe i hate you bol rahe ho ja main tujh se bat nahi kar thi 😪😪", threadID);
  };
  if ((event.body.toLowerCase() == "chutiya bot") || (event.body.toLowerCase() == "chutiye bot")) {
    return api.sendMessage("Hmm... Tu chutiya phle ungli kyun ki chomu 😾", threadID);
  };
  if ((event.body.toLowerCase() == "busy")) {
    return api.sendMessage("Okay main busy hoon abhi", threadID);
  };
  if ((event.body.toLowerCase() == "shaan") || (event.body.toLowerCase() == "shan")) {
    return api.sendMessage("Boss AHMAD RDX busy hai mujse bat karo 🙄", threadID);
  };
  if ((event.body.toLowerCase() == "janu") || (event.body.toLowerCase() == "jan")) {
    return api.sendMessage("Janu me serf AHMAD RDX ki hu samjhy", threadID);
  };
  if ((event.body.toLowerCase() == "thank you") || (event.body.toLowerCase() == "thanks")) {
    return api.sendMessage("Bas bas kitna tarif karoge 🤭🤭😁", threadID);
  };
  if ((event.body.toLowerCase() == "hi") || (event.body.toLowerCase() == "hello")) {
    return api.sendMessage("Next hi/hello nhi Assalamualaikum bola kro okay 💖", threadID);
  };
  if ((event.body.toLowerCase() == "ganda") || (event.body.toLowerCase() == "ganda bot")) {
    return api.sendMessage("Tu ganda tera pura khandan ganda 😒😐", threadID);
  };
  if ((event.body.toLowerCase() == "shaan kon ho ap") || (event.body.toLowerCase() == "shaan ap kon ho")) {
    return api.sendMessage("I'm ROBOT 🤖 2.0 like chitti Robot 😂", threadID, messageID);
  };
  if ((event.body.toLowerCase() == "mar ja") || (event.body.toLowerCase() == "kill you")) {
    return api.sendMessage("Sorry boss ab aasa nahi karungi babu solly 😭", threadID);
  };
  if ((event.body.toLowerCase() == "ib aa")) {
    return api.sendMessage("Jo bol na hai sab ke samne bol tharki 🙄🙄", threadID);
  };
  if ((event.body.toLowerCase() == "inbox aa")) {
    return api.sendMessage("Kab sai hoga ye system har koi inbox 📥 jana chata 😀🙄🙄", threadID);
  };
  if ((event.body.toLowerCase() == "ladki ho")) {
    return api.sendMessage("Nahi ye both hai tharki insan 😂😀🙄", threadID);
  };
  if ((event.body.toLowerCase() == "wow")) {
    return api.sendMessage("Thank you apko bhi bot chahiya tOo AHMAD RDX se rabta karo 👍👍", threadID);
  };
  if ((event.body.toLowerCase() == "delete")) {
    return api.sendMessage("Baja kyu fir delete karne bol rahe he ho 🙄🙄", threadID);
  };
  if ((event.body.toLowerCase() == "logos") || (event.body.toLowerCase() == "logo")) {
    return api.sendMessage("Logos ! 🥀 GALAXY, CAKE, CRACK, GLITCH, CLOUD, DRAGON, FROZEN, BUSINESS, ANIMATE, LOGODIAMOND, LOGOCAPTAIN, LOGOFISH, LOGOCOLORBLUR, LOGOBLOODTEXT, LOGOWOOD, LOGOCUP 🥀for example -> +crack AHMAD RDX", threadID);
  };
  if ((event.body.toLowerCase() == "good night") || (event.body.toLowerCase() == "gn")) {
    return api.sendMessage("❤️ Good night too darling sweet dreams 🥰", threadID, messageID);
  };
  if ((event.body.toLowerCase() == "tharki bot") || (event.body.toLowerCase() == "tharki")) {
    return api.sendMessage("Tum tharki me to masoom sa bot hu 🙄🙄🆗", threadID);
  };
  if ((event.body.toLowerCase() == "السلام عليكم")) {
    return api.sendMessage("وعلیکم السلام ورحمۃ اللہ وبرکاتہ", threadID);
  };
  if ((event.body.toLowerCase() == "morning") || (event.body.toLowerCase() == "good morning")) {
    return api.sendMessage("Good morning god bless you janu 💓", threadID);
  };
  if ((event.body.toLowerCase() == "koi hai")) {
    return api.sendMessage("Main hun na jaaneman ❤️", threadID);
  };
  if ((event.body.toLowerCase() == "owner") || (event.body.toLowerCase() == "bot ka malik")) {
    return api.sendMessage("༻𝐎𝐖𝐍𝐄𝐑:- ☞ 𖠁 [ 𝐎𝐖𝐍𝐄𝐑: 𝐀𝐇𝐌𝐀𝘿 𝐑𝐃𝐗 ] 🎸 𖠁 \n📱 WhatsApp: +92306*******\n✈️ Telegram: ahmadalisafdar3\n🌐 Facebook: https://www.facebook.com/profile.php?id=100016828397863", threadID);
  };
  if ((event.body.toLowerCase() == "tera malik kon hai") || (event.body.toLowerCase() == "is bot ka malik kon hai")) {
    return api.sendMessage("AHMAD RDX ❤️ My Creator. He loves me & edit me daily. WhatsApp: +92306******* | Telegram: ahmadalisafdar3", threadID);
  };
  if ((event.body.toLowerCase() == "acha") || (event.body.toLowerCase() == "acha ji")) {
    return api.sendMessage("🤍 Hanji meri jaan 🙈✨", threadID);
  };
  if ((event.body.toLowerCase() == "by") || (event.body.toLowerCase() == "bye")) {
    return api.sendMessage("BYE BYE TAKE CARE SEE YOU SOON 😘😘", threadID);
  };
  if ((event.body.toLowerCase() == "shadi karoge") || (event.body.toLowerCase() == "mujhse shadi karoge")) {
    return api.sendMessage("Hanji, karunga lekin baccha apke pet m hoga. Manjur he to bato me tayar hu 🙊🙊", threadID);
  };
  if ((event.body.toLowerCase() == "chup") || (event.body.toLowerCase() == "stop")) {
    return api.sendMessage("Nhi rahungi 😼 Mujhe bolna h. Tumhe koi haq nhi mujhe chup karane ka. AHMAD RDX ko baton kya 🙄🙄", threadID);
  };
  if ((event.body.toLowerCase() == "i love you") || (event.body.toLowerCase() == "love you")) {
    return api.sendMessage("ITNE MUJHE I LOVE YOU BOL RHI HO MERE BOSS AHMAD RDX KO BOLO BAHUT HI ACHA BNDA HAI MERA BOSS", threadID);
  };
  if ((event.body.toLowerCase() == "i miss you") || (event.body.toLowerCase() == "miss u")) {
    return api.sendMessage("i miss you too my love ummah 😘😘😘", threadID);
  };
  if ((event.body.toLowerCase() == "kese ho") || (event.body.toLowerCase() == "kaise ho")) {
    return api.sendMessage("M to cute hu aap batao kese ho 🤭☺️", threadID);
  };

  // Main Bot Prefix / Noprefix Call Trigger
  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
    var msg = {
      body: `💞 👉 ${name} 👈 💞\n\n` +
            `❖•A━━━━━ 👑 ━━━━━R•❖\n\n` +
            `${rand}\n\n` +
            `❖•A━━━━━ 👑 ━━━━━R•❖\n\n` +
            `👑 𝐎𝐖𝐍𝐄𝐑: 𝐀𝐇𝐌𝐀𝘿 𝐑𝐃𝐗\n` +
            `✨ 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: MR AHMII`
    }
    return api.sendMessage(msg, threadID, messageID);
  };
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
    
