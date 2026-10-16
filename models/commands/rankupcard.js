const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "rankup",
    version: "12.1.0-AHMAD-RDX",
    hasPermssion: 1,
    credits: "AHMAD RDX",
    description: "Premium Rankup Card",
    commandCategory: "Edit-IMG",
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    },
    cooldowns: 2
};

// ===== LEVEL FORMULA =====
function getLevel(xp) {
    return Math.floor((Math.sqrt(1 + (4 * xp / 3)) + 1) / 2);
}

// ===== ON / OFF COMMAND =====
module.exports.run = async function ({
    api,
    event,
    Threads,
    Currencies,
    Users,
    getText,
    args
}) {
    const { threadID, messageID, senderID } = event;

    // ===== TEST CARD =====
    if (args && args[0] && args[0].toLowerCase() === "test") {
        return module.exports.handleEvent({
            api,
            event: {
                ...event,
                rankupTest: true
            },
            Currencies,
            Users,
            getText
        });
    }

    // ===== TOGGLE RANKUP =====
    let data = (await Threads.getData(threadID)).data || {};

    data.rankup = !data.rankup;

    await Threads.setData(threadID, { data });
    global.data.threadData.set(String(threadID), data);

    return api.sendMessage(
        data.rankup
            ? "👑 AHMAD RDX PREMIUM RANKUP CARD ON"
            : "❌ AHMAD RDX RANKUP CARD OFF",
        threadID,
        messageID
    );
};

// ===== RANKUP EVENT =====
module.exports.handleEvent = async function ({
    api,
    event,
    Currencies,
    Users,
    getText
}) {
    const { threadID, senderID } = event;

    if (!threadID || !senderID) return;

    const isTest = event.rankupTest === true;

    try {
        // ===== GROUP SETTING =====
        const threadData =
            global.data.threadData.get(String(threadID)) || {};

        // Default ON; only stop normal rankup when OFF
        if (!isTest && threadData.rankup === false) {
            const oldData = await Currencies.getData(senderID);
            const exp = Number(oldData.exp) || 0;

            await Currencies.setData(senderID, { exp: exp + 1 });
            return;
        }

        // ===== XP =====
        const currencyData = await Currencies.getData(senderID);
        let exp = Number(currencyData.exp) || 0;

        let curLevel;
        let nextLevel;

        if (isTest) {
            // Test does not change XP
            curLevel = getLevel(exp);
            nextLevel = curLevel + 1;
        } else {
            const oldExp = exp;
            exp += 1;

            curLevel = getLevel(oldExp);
            nextLevel = getLevel(exp);

            await Currencies.setData(senderID, { exp });

            if (nextLevel <= curLevel || nextLevel === 1) return;
        }

        // ===== USER NAME =====
        const name =
            global.data.userName.get(String(senderID)) ||
            await Users.getNameUser(senderID);

        // ===== AVATAR =====
        let avatar;

        try {
            const info = await api.getUserInfo(senderID);
            const avatarURL = info[senderID]?.profileUrl;

            if (!avatarURL) {
                throw new Error("Avatar URL not found");
            }

            const response = await axios.get(avatarURL, {
                responseType: "arraybuffer",
                timeout: 15000
            });

            avatar = await loadImage(Buffer.from(response.data));
        } catch (error) {
            console.error("AHMAD RDX avatar error:", error);

            if (isTest) {
                return api.sendMessage(
                    "❌ Test failed: avatar load nahi hua. Console check karo.",
                    threadID
                );
            }
            return;
        }

        // ===== CANVAS =====
        const width = 1200;
        const height = 500;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background
        const background = ctx.createLinearGradient(
            0, 0, width, height
        );

        background.addColorStop(0, "#03030B");
        background.addColorStop(0.48, "#17082B");
        background.addColorStop(1, "#050510");

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        // Glow
        function glow(x, y, radius, color) {
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, radius
            );

            gradient.addColorStop(0, color);
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(
                x - radius,
                y - radius,
                radius * 2,
                radius * 2
            );
        }

        glow(260, 230, 350, "rgba(130,50,255,0.25)");
        glow(1050, 80, 350, "rgba(255,190,60,0.15)");

        // Rounded rectangle
        function roundRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(
                x + w, y + h,
                x + w - r, y + h
            );
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(
                x, y + h,
                x, y + h - r
            );
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }

        // Main card
        roundRect(25, 25, 1150, 450, 30);
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(190,140,255,0.65)";
        ctx.stroke();

        // Top accent
        const accent = ctx.createLinearGradient(50, 0, 1150, 0);
        accent.addColorStop(0, "#8A4DFF");
        accent.addColorStop(0.5, "#FFD98A");
        accent.addColorStop(1, "#8A4DFF");

        roundRect(60, 43, 1080, 5, 3);
        ctx.fillStyle = accent;
        ctx.fill();

        // Avatar
        const avatarSize = 245;
        const avatarX = 95;
        const avatarY = 110;

        const centerX = avatarX + avatarSize / 2;
        const centerY = avatarY + avatarSize / 2;

        ctx.save();
        ctx.shadowColor = "#A855FF";
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            avatarSize / 2 + 5,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "#A855FF";
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            avatarSize / 2,
            0,
            Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(
            avatar,
            avatarX,
            avatarY,
            avatarSize,
            avatarSize
        );
        ctx.restore();

        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            avatarSize / 2 + 4,
            0,
            Math.PI * 2
        );
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#FFD98A";
        ctx.stroke();

        // VIP badge
        roundRect(135, 385, 165, 48, 22);
        ctx.fillStyle = "#FFD98A";
        ctx.fill();

        ctx.font = "bold 24px Sans";
        ctx.textAlign = "center";
        ctx.fillStyle = "#17082B";
        ctx.fillText("✦ VIP ✦", 217, 416);

        // Level up title
        ctx.textAlign = "left";
        ctx.font = "bold 66px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(160,100,255,0.8)";
        ctx.shadowBlur = 20;
        ctx.fillText("LEVEL UP!", 410, 125);
        ctx.shadowBlur = 0;

        // User name
        let displayName = String(name || "Member");

        if (displayName.length > 22) {
            displayName = displayName.slice(0, 20) + "...";
        }

        ctx.font = "bold 40px Sans";
        ctx.fillStyle = "#FFD98A";
        ctx.fillText(displayName, 415, 190);

        // Congratulations
        ctx.font = "24px Sans";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText(
            isTest
                ? "Premium Rankup Card Test"
                : "Congratulations! Your hard work paid off.",
            415,
            235
        );

        // Level box
        roundRect(405, 265, 660, 100, 20);
        ctx.fillStyle = "rgba(255,255,255,0.055)";
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,217,138,0.55)";
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.font = "bold 30px Sans";
        ctx.fillStyle = "#B8B4C9";
        ctx.fillText(`LEVEL ${curLevel}`, 545, 325);

        ctx.font = "bold 38px Sans";
        ctx.fillStyle = "#FFD98A";
        ctx.fillText("➜", 735, 325);

        ctx.font = "bold 42px Sans";
        ctx.fillStyle = "#FFD98A";
        ctx.fillText(`LEVEL ${nextLevel}`, 925, 327);

        // XP progress
        const currentLevelXP = 3 * curLevel * (curLevel - 1);
        const nextLevelXP = 3 * nextLevel * (nextLevel - 1);

        const progress = Math.max(
            0,
            Math.min(
                1,
                (exp - currentLevelXP) /
                Math.max(1, nextLevelXP - currentLevelXP)
            )
        );

        ctx.textAlign = "left";
        ctx.font = "bold 20px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("XP PROGRESS", 410, 400);

        roundRect(410, 415, 650, 18, 9);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fill();

        const barWidth = Math.max(1, 650 * progress);

        roundRect(410, 415, barWidth, 18, 9);

        const xpGradient = ctx.createLinearGradient(
            410, 0, 1060, 0
        );
        xpGradient.addColorStop(0, "#8A4DFF");
        xpGradient.addColorStop(1, "#FFD98A");

        ctx.fillStyle = xpGradient;
        ctx.fill();

        ctx.font = "bold 17px Sans";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(
            `${exp - currentLevelXP} / ${nextLevelXP - currentLevelXP} XP`,
            410,
            455
        );

        // Branding
        ctx.textAlign = "center";
        ctx.font = "bold 24px Sans";
        ctx.fillStyle = "#FFD98A";
        ctx.fillText("AHMAD RDX", 800, 455);

        // ===== SAVE CARD =====
        const cachePath = __dirname + "/cache";
        fs.ensureDirSync(cachePath);

        const imgPath =
            cachePath + `/rankup_${threadID}_${senderID}_${Date.now()}.png`;

        fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

        // ===== MESSAGE =====
        let message = isTest
            ? `🧪 Rankup Card Test\n👑 ${displayName}\n✨ Level ${nextLevel} preview`
            : (
                typeof threadData.customRankup === "undefined"
                    ? getText("levelup")
                    : threadData.customRankup
            );

        message = message
            .replace(/\{name\}/g, displayName)
            .replace(/\{level\}/g, String(nextLevel));

        // ===== SEND =====
        api.sendMessage(
            {
                body: message,
                mentions: [
                    {
                        tag: displayName,
                        id: senderID
                    }
                ],
                attachment: fs.createReadStream(imgPath)
            },
            threadID,
            error => {
                if (error) {
                    console.error("AHMAD RDX send error:", error);
                }

                fs.remove(imgPath, () => {});
            }
        );

    } catch (error) {
        console.error("AHMAD RDX rankup error:", error);

        if (isTest) {
            return api.sendMessage(
                "❌ Rankup test failed. Bot console ka error check karo.",
                threadID
            );
        }
    }
};

// ===== LANGUAGE =====
module.exports.languages = {
    en: {
        on: "👑 AHMAD RDX RANKUP ON",
        off: "❌ AHMAD RDX RANKUP OFF",
        successText: "✨",
        levelup:
            "🎉 LEVEL UP! 🎉\n\n" +
            "👑 {name}\n" +
            "🔥 You reached Level {level}!\n\n" +
            "💜 Keep Growing • Keep Winning"
    }
};
