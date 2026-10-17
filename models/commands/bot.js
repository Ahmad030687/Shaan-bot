
module.exports.config = {
  name: "goibot",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "MR SHAAN",
  description: "AHMAD RDX Funny Roast Bot",
  commandCategory: "Noprefix",
  usages: "bot / joke",
  cooldowns: 2
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body || !senderID) return;

  const msg = body.toLowerCase().trim();

  const frame = (text) =>
    `╭─『 👑 AHMAD RDX 』─╮\n\n` +
    `${text}\n\n` +
    `╰─♡ Premium Bot ♡─╯`;

  const jokes = [
    "😂 Bhai teri shakal dekh kar front camera bhi back camera ban'na chahta hai!",
    "🤣 Tu itna single hai ke shaadi ke card par tera naam guest list mein bhi nahi aata!",
    "💀 Bhai tera attitude iPhone 16 wala, budget keypad mobile wala!",
    "😭 Teri love story itni short hai ke trailer bhi release nahi hua!",
    "😂 Tu group mein hero banta hai, call par mic bhi on nahi karta!",
    "🤣 Bhai teri kismat ko dekh kar lottery wala bhi refund maang le!",
    "💀 Teri personality ka password kya hai? Kyun ke kuch unlock hi nahi ho raha!",
    "😂 Tu itna slow hai ke tere khayal bhi loading lete hain!",
    "🤣 Bhai tu crush ko impress karne gaya tha ya usko hansane?",
    "😭 Tera confidence dekh kar galat jawab bhi sharma jaye!",
    "😂 Tu itna kanjoos hai ke birthday par apni age bhi share nahi karta!",
    "🤣 Teri selfie dekh kar filter ne khud resignation de diya!",
    "💀 Bhai tu single nahi, duniya ne tujhe free trial par bhi reject kar diya!",
    "😂 Teri shakal par smile aise hai jaise bijli ka bill maaf ho gaya!",
    "🤣 Tu itna berozgar hai ke Monday bhi tujhe dekh kar udaas ho jata hai!",
    "😭 Bhai tera swag dekh kar kapray bhi sochte hain: hum kahan phans gaye!",
    "😂 Tu online sab ka sher, saamne sab ka shareef!",
    "🤣 Teri love life mein sirf ek cheez stable hai: rejection!",
    "💀 Bhai tu itna innocent hai ke scammer bhi tujhe scam karke guilt mein chala jaye!",
    "😂 Tera dimagh airplane mode pe hai, ideas connect hi nahi hote!",
    "🤣 Tu itna late reply karta hai ke message bhejne wala shaadi karke bachay bhi kar le!",
    "😭 Bhai tera hairstyle dekh kar kanghi ne job chhor di!",
    "😂 Tu apni crush ko good morning bhejta hai, jawab Eid par aata hai!",
    "🤣 Tera bank balance aur tera confidence opposite directions mein hain!",
    "💀 Bhai tu itna confused hai ke Google Maps bhi tujhe ghar ka rasta na bataye!",
    "😂 Tu group ka admin nahi, bas free ka security guard hai!",
    "🤣 Teri baatein sun kar silence bhi interesting lagne lagti hai!",
    "😭 Bhai tera swag dekh kar mirror ne brightness kam kar di!",
    "😂 Tu itna lazy hai ke sapne mein bhi snooze button dabata hai!",
    "🤣 Teri planning NASA wali, execution chhutti par!",
    "💀 Bhai tera joke sun kar hansi ne bhi seen karke chhor diya!",
    "😂 Tu itna overconfident hai ke exam mein naam likh kar topper wali feeling leta hai!",
    "🤣 Teri shakal dekh kar AI bhi kehta hai: prompt dobara likho!",
    "😭 Bhai tu crush ke saamne itna nervous hota hai ke salam ki jagah password bata deta hai!",
    "😂 Tu itna broke hai ke wallet kholne se pehle dua karta hai!",
    "🤣 Teri personality ka update abhi tak download nahi hua!",
    "💀 Bhai tu itna slow hai ke tortoise bhi tujhe overtake karke horn maare!",
    "😂 Tu gym sirf mirror ke saath relationship banane jata hai!",
    "🤣 Tera attitude dekh kar lagta hai bank account mein millions hain, phir tu udhaar maang leta hai!",
    "😭 Bhai teri crush ne tujhe bhai kaha, ab rakhi ka season bhi aa gaya!",
    "😂 Tu itna dramatic hai ke chhink bhi aaye to farewell speech deta hai!",
    "🤣 Teri life ka hero tu hai, bas audience ghar chali gayi!",
    "💀 Bhai tu itna famous hai ke tere messages ko bhi koi nahi jaanta!",
    "😂 Tu itna innocent banta hai ke teri search history bhi hans rahi hoti hai!",
    "🤣 Tera style dekh kar fashion ne aankhein band kar li!",
    "😭 Bhai tu apni selfie ko itna edit karta hai ke asal banda khud ko pehchan na sake!",
    "😂 Tu itna single hai ke Valentine Day par bhi delivery wala tujhe bhai bolta hai!",
    "🤣 Teri love life ka network hamesha unavailable rehta hai!",
    "💀 Bhai tera attitude VIP, lekin entry hamesha waiting list se!",
    "😂 Tu itna bhoola hai ke apna joke suna kar khud hi poochta hai punchline kya thi!",
    "🤣 Tere plans itne fail hote hain ke calendar bhi tujh se umeed nahi rakhta!",
    "😭 Bhai tu itna shareef hai ke insult bhi permission le kar karta hai!",
    "😂 Tu group mein typing karta hai aur phir poora message delete kar deta hai!",
    "🤣 Tera dimagh itna khaali hai ke echo bhi rent maangta hai!",
    "💀 Bhai tu itna unlucky hai ke free WiFi bhi password maang kar tujhe reject kar de!",
    "😂 Tu apni crush ke liye status lagata hai, woh samajhti hai internet ka issue hai!",
    "🤣 Teri shakal dekh kar camera kehta hai: bhai main sirf device hoon!",
    "😭 Bhai tu itna slow hai ke tera reply agle version mein aayega!",
    "😂 Tu itna kanjoos hai ke dost ko birthday wish bhi data saver mode mein karta hai!",
    "🤣 Teri personality ka demo acha tha, full version mein bugs hi bugs hain!",
    "💀 Bhai tera confidence dekh kar sach bhi confuse ho jata hai!",
    "😂 Tu itna single hai ke couple wali reel dekh kar phone ko hi hug karta hai!",
    "🤣 Tera hairstyle dekh kar barber bhi kehta hai: bhai experiment tha!",
    "😭 Bhai tu crush ko impress karne gaya, wapas uska bhai ban kar aaya!",
    "😂 Tu itna berozgar hai ke job application bhi tujhe ignore kar deti hai!",
    "🤣 Tera attitude dekh kar lagta hai tu celebrity hai, par tujhe ghar wale bhi kaam dete hain!",
    "💀 Bhai tu itna confused hai ke apni hi baat ka reply kisi aur se poochta hai!",
    "😂 Tu itna late aata hai ke surprise party bhi khatam ho jati hai!",
    "🤣 Teri love story ka villain koi aur nahi, tera apna 'bro' hai!",
    "😭 Bhai tera phone tujh se zyada smart hai, phir bhi tu usko samjha raha hota hai!",
    "😂 Tu itna lazy hai ke remote paas ho kar bhi kisi aur ko bulata hai!",
    "🤣 Teri shakal par itna confidence hai ke mirror bhi sach bolne se darta hai!",
    "💀 Bhai tu itna famous hai ke tere ghar wale bhi tera message group mein poochte hain!",
    "😂 Tu apni life ka CEO hai, magar salary abhi tak pending hai!",
    "🤣 Teri planning dekh kar calculator bhi kehta hai: bhai rehne de!",
    "😭 Bhai tu itna emotional hai ke WiFi disconnect ho to breakup samajhta hai!",
    "😂 Tu itna funny hai ke joke sunane se pehle log hansna band kar dete hain!",
    "🤣 Teri kismat ka software corrupt hai, update se bhi theek nahi hota!",
    "💀 Bhai tu itna confident hai ke wrong number par bhi hello jaan keh deta hai!",
    "😂 Tu itna single hai ke wedding hall wale tujhe permanent customer samajhte hain!",
    "🤣 Teri shakal dekh kar beauty filter ne kaha: bhai main overtime nahi karunga!",
    "😭 Bhai tera swag dekh kar gali ka kutta bhi route change kar leta hai!",
    "😂 Tu itna slow hai ke tere jokes par log agle din hanste hain!",
    "🤣 Teri crush ne reply diya 'okay', aur tu ne future ke bachon ke naam soch liye!",
    "💀 Bhai tu itna broke hai ke ATM bhi tujhe dekh kar sorry bolta hai!",
    "😂 Tu group mein attitude dikhata hai, ammi ki awaaz par offline ho jata hai!",
    "🤣 Teri life ek movie hai: budget kam, problems zyada!",
    "😭 Bhai tu itna lazy hai ke khana khane se pehle bhi motivation video dekhta hai!",
    "😂 Tu itna overthink karta hai ke 'ok' ka matlab 17 baar check karta hai!",
    "🤣 Tera style dekh kar kapron ne bhi kaha: bhai humari kya ghalti thi!",
    "💀 Bhai tu itna innocent hai ke apne hi roast ko compliment samajh leta hai!",
    "😂 Tu itna single hai ke Cupid ne tera address delete kar diya!",
    "🤣 Teri love life ka status: no signal, no service, no hope!",
    "😭 Bhai tu itna dramatic hai ke battery 2% ho to wasiyat likhne lagta hai!",
    "😂 Tu itna kanjoos hai ke apne birthday par khud ko bhi gift nahi deta!",
    "🤣 Teri selfie mein filter zyada, banda kam nazar aata hai!",
    "💀 Bhai tu itna confused hai ke left aur right bhi tujh se poochte hain!",
    "😂 Tu itna late reply karta hai ke message bhejne wala apna account delete kar de!",
    "🤣 Teri personality ka trailer dekh kar audience ne cinema chhor diya!",
    "😭 Bhai tu itna single hai ke pillow bhi doosri side so jata hai!",
    "😂 Tu itna attitude dikhata hai ke lift bhi tujhe upar le jaane se pehle sochti hai!",
    "🤣 Teri kismat itni kharab hai ke raincoat pehne to dhoop nikal aaye!",
    "💀 Bhai tera dimagh itna khaali hai ke us mein parking ban sakti hai!",
    "😂 Tu itna funny hai ke teri baat par sirf tu hi hasta hai!",
    "🤣 Teri crush ne tujhe bhai kaha, aur tu ne kaha: family mein welcome!",
    "😭 Bhai tu itna lazy hai ke alarm band karne ke liye bhi dua karta hai!",
    "😂 Tu itna broke hai ke wallet mein sirf purani receipts aur umeedein hain!",
    "🤣 Tera confidence dekh kar motivational speaker bhi job chhor de!",
    "💀 Bhai tu itna slow hai ke loading screen tujhe dekh kar fast lagti hai!",
    "😂 Tu apni life ka hero hai, bas script writer ne mazaq kar diya!",
    "🤣 Teri shakal dekh kar mirror ka brightness auto adjust ho jata hai!",
    "😭 Bhai tu itna single hai ke relationship status bhi tujhe poochna bhool gaya!",
    "😂 Tu itna online rehta hai ke WiFi wale tujhe ghar ka member samajhte hain!",
    "🤣 Tera attitude iPhone wala, charging cable udhaar wali!",
    "💀 Bhai tu itna unlucky hai ke coin toss mein bhi coin khara ho jata hai!",
    "😂 Tu itna lazy hai ke khwab mein bhi kisi aur se kaam karwata hai!",
    "🤣 Teri love story mein sirf tu, tera phone aur seen status hai!",
    "😭 Bhai tu itna confused hai ke apni birthday party mein bhi poochta hai cake kis ka hai!",
    "😂 Tu itna overconfident hai ke exam mein blank paper de kar kehta hai: minimalism!",
    "🤣 Teri selfie dekh kar phone ne face unlock se inkaar kar diya!",
    "💀 Bhai tu itna kanjoos hai ke joke bhi aadha sunata hai!",
    "😂 Tu itna single hai ke shaadi ki biryani ke liye hi invitation ka wait karta hai!",
    "🤣 Tera swag local, attitude international, balance zero!",
    "😭 Bhai tu itna lazy hai ke sapne mein bhi Monday ko skip kar deta hai!",
    "😂 Tu itna innocent hai ke roast sun kar kehta hai: wah bhai tareef achi thi!",
    "🤣 AHMAD RDX bot ko bula liya? Ab bhai roast bhi free aur beizzati bhi free! 👑"
  ];

  const random = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  const send = (text) =>
    api.sendMessage(
      frame(text),
      threadID,
      undefined,
      messageID
    );

  // Jo bot ko bulaye, usko random roast
  if (
    msg === "bot" ||
    msg === "ahmad rdx" ||
    msg === "joke" ||
    msg === "roast" ||
    msg === "funny"
  ) {
    return send(`Oye ${senderID ? nameFallback(senderID) : "Bhai"} 😂\n${random(jokes)}`);
  }

  function nameFallback(id) {
    return global.Users?.getNameUser
      ? name
      : "Bhai";
  }

  const replies = {
    "hi": `Oye ${name} 😂 zinda hai ya sirf online dikh raha hai?`,
    "hello": `Hello ${name} 🤣 aaj kis ki beizzati karni hai?`,
    "salam": "Wa Alaikum Assalam 😂 aao roast ki mehfil lagayein!",
    "assalamualaikum": "Wa Alaikum Assalam ❤️ lekin roast se bach nahi sakte!",
    "owner": "👑 Owner: AHMAD RDX — roast department ka malik!",
    "love you": "😂 Pehle apni crush se confirm kar, phir mere paas aana!",
    "hug": "🤗 Hug free hai, lekin roast extra charge ka hai!",
    "good morning": "☀️ Uth ja bhai, sapnon mein bhi berozgar hai!",
    "good night": "🌙 So ja bhai, kal phir beizzati karwani hai!",
    "thanks": "😂 Welcome bhai, agli beizzati ke liye phir aana!",
    "bye": "👋 Allah Hafiz! Apna attitude ghar bhool kar mat jana!"
  };

  if (replies[msg]) return send(replies[msg]);
};

module.exports.run = function () {};
