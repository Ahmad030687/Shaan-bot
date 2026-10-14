/**
 * Module: Group Emoji Changer
 * Path: Sardar/commands/groupemoji.js
 * Credits: SHAAN BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
	name: "groupemoji",
	version: "2.0.0", 
	hasPermssion: 0,
	credits: "SHAAN BABU", // Strict core credit preserved
	description: "Changes the group default emoji with ultra-premium AHMAD RDX notifications",
	commandCategory: "CHANGE GROUP EMOJI", 
	usages: "[emoji]", 
	cooldowns: 2,
	dependencies: {} 
};

module.exports.run = async function({ api, event, args }) {
	const { threadID, messageID } = event;
	var emoji = args.join(" ").trim();

	if (!emoji) {
		const missingEmojiMsg = 
			"╔════════════════════════╗\n" +
			"║ ⚠️ MISSING EMOJI INPUT ║\n" +
			"╚════════════════════════╝\n\n" +
			"📌 Boss, saath mein koi ek emoji dalein jo group par lagana hai!\n" +
			"💡 Example: /groupemoji 🔥\n\n" +
			"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
			"👑 SYSTEM OWNER: AHMAD RDX\n" +
			"📱 WhatsApp: +92306*******\n" +
			"✈️ Telegram: ahmadalisafdar3";

		return api.sendMessage(missingEmojiMsg, threadID, messageID);
	}

	return api.changeThreadEmoji(emoji, threadID, (err) => {
		if (err) {
			const errorMsg = 
				"╔════════════════════════╗\n" +
				"║ ❌ EMOJI CHANGE ERROR  ║\n" +
				"╚════════════════════════╝\n\n" +
				"⚠️ Group emoji badalne mein error aaya hai! Check karein ke emoji valid hai ya nahi.\n\n" +
				"👑 POWERED BY: AHMAD RDX";

			return api.sendMessage(errorMsg, threadID, messageID);
		}

		const successMsg = 
			"╔════════════════════════╗\n" +
			"║  😃 GROUP EMOJI CHANGED ║\n" +
			"╚════════════════════════╝\n\n" +
			`✅ Boss, maine group ka default emoji kamyabi se badal diya hai!\n` +
			`🎭 New Group Emoji: ${emoji}\n\n` +
			"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
			"👑 SYSTEM OWNER: AHMAD RDX\n" +
			"📱 WhatsApp: +92306*******\n" +
			"✈️ Telegram: ahmadalisafdar3\n" +
			"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

		return api.sendMessage(successMsg, threadID, messageID);
	});
};
