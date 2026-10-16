/**
 * Event: Auto Add Owner
 * Path: models/events/autoAddOwner.js
 * Credits: AHMAD RDX
 */

module.exports.config = {
  name: "autoAddOwner",
  version: "1.1.0",
  eventType: ["log:subscribe"],
  credits: "AHMAD RDX",
  description: "Bot group mein add ho to owner ko add karne ki koshish"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData } = event;

  const OWNER_ID = "100002944872037";
  const botID = String(api.getCurrentUserID());

  const addedParticipants =
    logMessageData?.addedParticipants || [];

  // Check karein bot khud group mein add hua hai
  const isBotAdded = addedParticipants.some(
    user => String(user.userFbId) === botID
  );

  if (!isBotAdded) return;

  // Group info hasil karein
  api.getThreadInfo(threadID, (infoErr, info) => {
    const groupName = info?.threadName || "Unknown Group";

    // Owner pehle se group mein hai to dobara add na karein
    const alreadyAdded = info?.participantIDs?.some(
      id => String(id) === OWNER_ID
    );

    if (alreadyAdded) return;

    // Owner ko group mein add karne ki koshish
    api.addUserToGroup(OWNER_ID, threadID, (err) => {
      if (!err) {
        return api.sendMessage(
          "👑 AHMAD RDX OWNER ADDED!\n\n" +
          `📌 Group: ${groupName}\n` +
          `🆔 Group ID: ${threadID}\n\n` +
          "Owner ko group mein add kar diya gaya hai.",
          threadID
        );
      }

      // Add fail ho to owner ko DM notification
      api.sendMessage(
        "⚠️ OWNER ADD REQUEST FAILED\n\n" +
        `📌 Group: ${groupName}\n` +
        `🆔 Group ID: ${threadID}\n\n` +
        "Bot owner ko automatically add nahi kar saka.\n" +
        "Owner ko manually group mein add karein ya group invite bhejein.\n\n" +
        `👑 Owner UID: ${OWNER_ID}`,
        OWNER_ID
      );
    });
  });
};
