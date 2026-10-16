/**
 * Event: Auto Add Owner on Group Join
 * Path: models/events/autoAddOwner.js
 * Credits: AHMAD RDX
 */

module.exports.config = {
  name: "autoAddOwner",
  version: "1.0.0",
  credits: "AHMAD RDX",
  description: "Bot naye group mein add hone par owner ko automatic add kar deta hai"
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData } = event;

  // Check check karein ke kya event group mein kisi naye member/bot ke add hone ka hai
  if (logMessageType === "log:subscribe") {
    const addedParticipants = logMessageData.addedParticipants || [];
    const botID = api.getCurrentUserID();

    // Verify karein ke kya Bot khud is group mein add hua hai
    const isBotAdded = addedParticipants.some(user => user.userFbId === botID);

    if (isBotAdded) {
      // ⚠️ APNI FACEBOOK ID YAHAN LIKHEIN (Main Admin / Owner ID)
      const OWNER_ID = "100002944872037"; // Replace with your actual FB UID

      try {
        // Owner ko group mein add karne ki try karein
        await api.addUserToGroup(OWNER_ID, threadID);

        // Success Notification Group Mein Bhejain
        return api.sendMessage(
          `✦━━━ ❪ 👑 AHMAD RDX BOT ❫ ━━━✦\n\n` +
          `✅ Mujhe is group mein add karne ka shukriya!\n` +
          `👑 Mere Owner/Admin ko bhi group mein add kar diya gaya hai.`,
          threadID
        );
      } catch (err) {
        console.error("[AUTO ADD OWNER ERROR]:", err);
        
        // Agar privacy settings ki wajah se direct add na ho saky toh notification
        return api.sendMessage(
          `✦━━━ ❪ ⚠️ NOTICE ❫ ━━━✦\n\n` +
          `Aapne mujhe group mein add toh kar diya, lekin Owner Facebook privacy ki wajah se auto-add nahi ho sake.\n\n` +
          `👑 Owner ID: https://facebook.com/${OWNER_ID}`,
          threadID
        );
      }
    }
  }
};
