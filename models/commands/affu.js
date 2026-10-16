const axios = require("axios");

module.exports.config = {
    name: "affu",
    version: "4.1.0",
    hasPermssion: 0,
    credits: "AHMAD RDX",
    description: "Dewani AI — Pakistani Roman Urdu Chat",
    commandCategory: "ai",
    usages: "Reply to Dewani",
    cooldowns: 1
};

const OWNER = "AHMAD RDX";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM = `
You are Dewani, a caring, playful Pakistani AI companion.
Owner: ${OWNER}.

RULES:
- Speak natural Pakistani Roman Urdu / Hinglish.
- Keep replies short, usually 1-3 lines.
- Be sweet, caring and funny with suitable emojis.
- Match the user's mood and language.
- Never claim to be a real human.
- If user says "AI bolo", reply exactly:
"Main AHMAD RDX AI hoon 🙂❤️😌"
- Do not repeat the user's message.
- Avoid unnecessary formal language.
`;

const history = global.affu = global.affu || {};
const busy = new Set();

const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

async function askAI(messages) {
    let groqError = null;

    // 1. Groq primary
    if (process.env.GROQ_API_KEY) {
        try {
            const res = await axios.post(
                GROQ_URL,
                {
                    model: MODEL,
                    messages,
                    temperature: 0.7,
                    max_tokens: 180
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 20000
                }
            );

            const reply =
                res.data?.choices?.[0]?.message?.content;

            if (typeof reply === "string" && reply.trim()) {
                return reply.trim();
            }

            throw new Error("Groq returned an empty response");

        } catch (err) {
            groqError = err;
            console.error(
                "[GROQ ERROR]",
                err.response?.status,
                err.response?.data || err.message
            );
        }
    } else {
        console.error("[GROQ ERROR] GROQ_API_KEY is missing");
    }

    // 2. Pollinations fallback
    try {
        const prompt = messages.map(m =>
            `${m.role}: ${m.content}`
        ).join("\n");

        const res = await axios.get(
            `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
            {
                params: {
                    model: "openai"
                },
                timeout: 25000,
                responseType: "text"
            }
        );

        const reply = String(res.data || "").trim();

        if (!reply) {
            throw new Error("Pollinations returned empty response");
        }

        return reply;

    } catch (err) {
        console.error(
            "[POLLINATIONS ERROR]",
            err.response?.status,
            err.response?.data || err.message
        );

        throw new Error(
            "Both Groq and Pollinations failed. " +
            (groqError?.message || "")
        );
    }
}

module.exports.handleEvent = async function ({
    api,
    event
}) {
    try {
        const {
            threadID,
            messageID,
            senderID,
            body,
            messageReply
        } = event;

        if (!body || !senderID) return;
        if (senderID == api.getCurrentUserID()) return;

        const text = body.trim();
        if (!text) return;

        // Dewani name trigger
        if (text.toLowerCase() === "dewani") {
            return api.sendMessage(
                "Haan ji Ahmad Sahab? Dewani hazir hai ✨❤️",
                threadID,
                messageID
            );
        }

        // Only reply to bot messages
        const isReply =
            messageReply &&
            messageReply.senderID == api.getCurrentUserID();

        if (!isReply) return;

        // Identity shortcut
        if (/^ai bolo$/i.test(text)) {
            return api.sendMessage(
                "Main AHMAD RDX AI hoon 🙂❤️😌",
                threadID,
                messageID
            );
        }

        const key = `${threadID}_${senderID}`;

        // Prevent simultaneous requests from corrupting history
        if (busy.has(key)) {
            return api.sendMessage(
                "Ek second ji 🥺 Pehle wala reply complete hone do.",
                threadID,
                messageID
            );
        }

        busy.add(key);

        try {
            api.setMessageReaction(
                "⌛",
                messageID,
                () => {},
                true
            );

            history[key] = history[key] || [];

            // Add user message
            history[key].push({
                role: "user",
                content: text
            });

            // Keep recent messages only
            history[key] = history[key].slice(-8);

            const messages = [
                {
                    role: "system",
                    content: SYSTEM
                },
                ...history[key]
            ];

            let reply = await askAI(messages);

            reply = String(reply)
                .replace(/^(Dewani|Assistant|AI)\s*:\s*/i, "")
                .trim();

            if (!reply) {
                throw new Error("Empty AI response");
            }

            // Save successful answer
            history[key].push({
                role: "assistant",
                content: reply
            });

            history[key] = history[key].slice(-8);

            api.setMessageReaction(
                "✅",
                messageID,
                () => {},
                true
            );

            return api.sendMessage(
                reply,
                threadID,
                messageID
            );

        } catch (err) {
            console.error(
                "[DEWANI AI ERROR]",
                err.message
            );

            // Remove failed user message from history
            if (history[key]?.length) {
                history[key].pop();
            }

            api.setMessageReaction(
                "❌",
                messageID,
                () => {},
                true
            );

            return api.sendMessage(
                "Uff, abhi AI service busy hai 🥺 " +
                "Thori dair baad dobara try karo.",
                threadID,
                messageID
            );

        } finally {
            busy.delete(key);
        }

    } catch (err) {
        console.error("[AFFU EVENT ERROR]", err);
    }
};

module.exports.run = async function ({
    api,
    event
}) {
    return api.sendMessage(
        "💗 Dewani se baat karne ke liye mere kisi message par Reply karein!",
        event.threadID,
        event.messageID
    );
};
