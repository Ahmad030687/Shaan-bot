
const axios = require("axios");

module.exports.config = {
    name: "affu",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Shaan Khan",
    description: "Dewani AI — Premium Pakistani Chat",
    commandCategory: "ai",
    usages: "Reply to Dewani",
    cooldowns: 1
};

const OWNER = "AHMAD RDX";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `
You are Dewani, a caring, playful and slightly flirty Pakistani AI companion.
Owner: ${OWNER}.

RULES:
- Speak natural Pakistani Roman Urdu / Hinglish.
- Keep replies short, usually 1-3 lines.
- Be sweet, caring, funny and expressive with suitable emojis.
- Match the user's mood and language.
- Never claim to be a real human or actual girlfriend.
- If user says "AI bolo", reply exactly:
"Main AHMAD RDX AI hoon 🙂❤️😌"
- Do not repeat the user's message.
- Avoid unnecessary formal language.
`;

const history = global.affu = global.affu || {};

async function askAI(messages) {
    // Groq primary
    if (process.env.GROQ_API_KEY) {
        try {
            const res = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: MODEL,
                    messages,
                    temperature: 0.85,
                    max_tokens: 180
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 20000
                }
            );

            return res.data.choices[0].message.content.trim();
        } catch (err) {
            console.error("[GROQ ERROR]", err.response?.data || err.message);
        }
    }

    // Pollinations fallback
    const prompt = messages.map(m =>
        `${m.role}: ${m.content}`
    ).join("\n");

    const res = await axios.get(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`,
        { timeout: 25000 }
    );

    return String(res.data).trim();
}

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;

    if (!body || senderID == api.getCurrentUserID()) return;

    const text = body.trim();
    const isDewani = text.toLowerCase() === "dewani";
    const isReply = messageReply &&
        messageReply.senderID == api.getCurrentUserID();

    if (isDewani) {
        return api.sendMessage(
            `Haan ji Ahmad Sahab? Dewani hazir hai ✨❤️`,
            threadID,
            messageID
        );
    }

    if (!isReply) return;

    // AI identity shortcut
    if (/^ai bolo$/i.test(text)) {
        return api.sendMessage(
            "Main AHMAD RDX AI hoon 🙂❤️😌",
            threadID,
            messageID
        );
    }

    api.setMessageReaction("⌛", messageID, () => {}, true);

    const key = `${threadID}_${senderID}`;
    history[key] = history[key] || [];

    history[key].push({ role: "user", content: text });
    history[key] = history[key].slice(-8);

    try {
        const messages = [
            { role: "system", content: SYSTEM },
            ...history[key]
        ];

        let reply = await askAI(messages);

        reply = reply
            .replace(/^(Dewani|Assistant|AI)\s*:\s*/i, "")
            .trim();

        if (!reply) throw new Error("Empty AI response");

        history[key].push({ role: "assistant", content: reply });
        history[key] = history[key].slice(-8);

        api.setMessageReaction("✅", messageID, () => {}, true);
        return api.sendMessage(reply, threadID, messageID);

    } catch (err) {
        console.error("[DEWANI AI ERROR]", err.message);

        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
            "Uff, abhi AI thora busy hai 🥺 Thori dair baad try karo.",
            threadID,
            messageID
        );
    }
};

module.exports.run = async function ({ api, event }) {
    return api.sendMessage(
        "💗 Dewani se baat karne ke liye mere kisi message par Reply karein!",
        event.threadID,
        event.messageID
    );
};
