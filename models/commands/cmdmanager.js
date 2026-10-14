/**
 * Command & Event Manager Engine
 * Path: models/commands/cmdmanager.js
 * Repo Target: Ahmad030687/Shaan-bot
 * Credits: SARDAR RDX (Strictly preserved)
 * Upgraded & Fixed by: AHMAD RDX
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const commandsDir = path.join(__dirname);
const eventsDir = path.join(__dirname, '..', 'events');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'Ahmad030687/Shaan-bot';
const GITHUB_BRANCH = 'main';

async function pushToGithub(filePathInRepo, content, commitMessage, sha = null) {
    if (!GITHUB_TOKEN) return false;
    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePathInRepo}`;
        const payload = {
            message: commitMessage,
            content: Buffer.from(content, 'utf8').toString('base64'),
            branch: GITHUB_BRANCH
        };
        if (sha) payload.sha = sha;

        await axios.put(url, payload, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AHMAD-RDX-Bot'
            }
        });
        return true;
    } catch (e) {
        return false;
    }
}

async function getGithubFileSha(filePathInRepo) {
    if (!GITHUB_TOKEN) return null;
    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePathInRepo}?ref=${GITHUB_BRANCH}`;
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AHMAD-RDX-Bot'
            }
        });
        return response.data.sha;
    } catch (e) {
        return null;
    }
}

function registerCommandToBot(localFilePath) {
    try {
        if (require.cache[require.resolve(localFilePath)]) {
            delete require.cache[require.resolve(localFilePath)];
        }
        const pull = require(localFilePath);
        global.client = global.client || {};
        global.client.commands = global.client.commands || new Map();
        global.client.aliases = global.client.aliases || new Map();

        if (pull.config && pull.config.name) {
            const cmdName = pull.config.name.toLowerCase();
            global.client.commands.set(cmdName, pull);
            if (pull.config.aliases && Array.isArray(pull.config.aliases)) {
                pull.config.aliases.forEach(alias => {
                    global.client.aliases.set(alias.toLowerCase(), cmdName);
                });
            }
            return true;
        }
    } catch (err) {
        console.error('[AHMAD RDX Load Error]:', err.message);
    }
    return false;
}

function registerEventToBot(localFilePath) {
    try {
        if (require.cache[require.resolve(localFilePath)]) {
            delete require.cache[require.resolve(localFilePath)];
        }
        const pull = require(localFilePath);
        global.client = global.client || {};
        global.client.events = global.client.events || new Map();

        if (pull.config && pull.config.name) {
            const evtName = pull.config.name.toLowerCase();
            global.client.events.set(evtName, pull);
            return true;
        }
    } catch (err) {
        console.error('[AHMAD RDX Event Load Error]:', err.message);
    }
    return false;
}

module.exports.config = {
    name: 'cmdmanager',
    aliases: ['addcmd', 'editcmd', 'cmd', 'load', 'editevt', 'addevt', 'evt'],
    version: '5.0.0',
    permission: 2,
    credits: 'SARDAR RDX', // Strict core credit preserved
    description: 'Direct Command & Event Manager by AHMAD RDX',
    commandCategory: 'system',
    cooldowns: 1
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { threadID, messageID, body, messageReply } = event;
        const cleanBody = (body || '').trim();
        const firstWord = cleanBody.split(/\s+/)[0].toLowerCase();

        const isEventMode = ['editevt', 'addevt', 'evt'].some(alias => firstWord.includes(alias));
        const targetType = isEventMode ? 'Event' : 'Command';
        const targetDir = isEventMode ? eventsDir : commandsDir;
        const repoSubDir = isEventMode ? 'models/events' : 'models/commands';

        if (!fs.existsSync(commandsDir)) fs.mkdirSync(commandsDir, { recursive: true });
        if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });

        if (!args[0]) {
            return api.sendMessage(
                `✦━━━ ❪ 💡 COMMAND MANAGER ❫ ━━━✦\n\n` +
                `📌 𝐔𝐒𝐀𝐆𝐄:\n` +
                `1️⃣ Code message par Reply karke likhein:\n` +
                `   👉 .editcmd <filename>\n\n` +
                `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`,
                threadID,
                messageID
            );
        }

        const fileNameOnly = args[0].toLowerCase().trim().replace(/\.js$/, '');
        const fileName = `${fileNameOnly}.js`;
        const localFilePath = path.join(targetDir, fileName);
        const githubPath = `${repoSubDir}/${fileName}`;

        // Safe check for message reply
        if (messageReply && messageReply.body) {
            const codeContent = messageReply.body.trim();

            await fs.writeFile(localFilePath, codeContent, 'utf8');
            const loaded = isEventMode ? registerEventToBot(localFilePath) : registerCommandToBot(localFilePath);

            const sha = await getGithubFileSha(githubPath);
            const ghSynced = await pushToGithub(githubPath, codeContent, `Update ${githubPath} via Reply`, sha);

            const statusMsg = 
                `✦━━ ❪ ⚙️ ${targetType.toUpperCase()} SAVED ❫ ━━✦\n\n` +
                `📁 File: ${repoSubDir}/${fileName}\n` +
                `⚡ Active Load: ${loaded ? 'SUCCESS ✅' : 'SYNTAX ERR ⚠️'}\n` +
                `☁️ GitHub Sync: ${ghSynced ? 'SUCCESS ✅' : 'PENDING ⚠️'}\n\n` +
                `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

            return api.sendMessage(statusMsg, threadID, messageID);
        }

        // Direct code paste check
        if (args.length >= 2) {
            const firstSpaceIndex = cleanBody.indexOf(' ');
            const secondSpaceIndex = cleanBody.indexOf(' ', firstSpaceIndex + 1);
            let codeContent = secondSpaceIndex !== -1 ? cleanBody.substring(secondSpaceIndex).trim() : '';

            if (codeContent) {
                await fs.writeFile(localFilePath, codeContent, 'utf8');
                const loaded = isEventMode ? registerEventToBot(localFilePath) : registerCommandToBot(localFilePath);

                const sha = await getGithubFileSha(githubPath);
                const ghSynced = await pushToGithub(githubPath, codeContent, `Update ${githubPath} Direct`, sha);

                const statusMsg = 
                    `✦━━ ❪ ⚙️ ${targetType.toUpperCase()} SAVED ❫ ━━✦\n\n` +
                    `📁 File: ${repoSubDir}/${fileName}\n` +
                    `⚡ Active Load: ${loaded ? 'SUCCESS ✅' : 'SYNTAX ERR ⚠️'}\n` +
                    `☁️ GitHub Sync: ${ghSynced ? 'SUCCESS ✅' : 'PENDING ⚠️'}\n\n` +
                    `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

                return api.sendMessage(statusMsg, threadID, messageID);
            }
        }

        // View file code if exists
        if (fs.existsSync(localFilePath)) {
            const oldCode = await fs.readFile(localFilePath, 'utf8');
            return api.sendMessage(`📜 Source code for "${fileName}":\n\n\`\`\`javascript\n${oldCode}\n\`\`\``, threadID, messageID);
        }

        return api.sendMessage(`❌ File "${repoSubDir}/${fileName}" nahi mili! Code bhej kar us par reply karein.`, threadID, messageID);

    } catch (err) {
        console.error("[CMDMANAGER CRITICAL ERROR]:", err);
        return api.sendMessage(`❌ Error aa gaya: ${err.message}`, event.threadID, event.messageID);
    }
};
