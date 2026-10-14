/**
 * Command & Event Manager Engine
 * Path: models/commands/cmdmanager.js
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

module.exports.config = {
    name: 'cmdmanager',
    aliases: ['addcmd', 'editcmd', 'cmd', 'load', 'editevt', 'addevt', 'evt'],
    version: '6.0.0',
    permission: 2,
    credits: 'SARDAR RDX', // Strict core credit preserved
    description: 'Direct Command Manager by AHMAD RDX',
    commandCategory: 'system',
    cooldowns: 1
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { threadID, messageID, type, messageReply } = event;

        if (!args[0]) {
            return api.sendMessage("💡 Usage: Code message par reply karke '.editcmd <cmd_name>' likhein.", threadID, messageID);
        }

        const fileNameOnly = args[0].toLowerCase().trim().replace(/\.js$/, '');
        const fileName = `${fileNameOnly}.js`;
        const localFilePath = path.join(commandsDir, fileName);
        const githubPath = `models/commands/${fileName}`;

        // Safe Message Reply Detection
        if (type === 'message_reply' && messageReply && messageReply.body) {
            const codeContent = messageReply.body.trim();

            await fs.writeFile(localFilePath, codeContent, 'utf8');
            const loaded = registerCommandToBot(localFilePath);

            const sha = await getGithubFileSha(githubPath);
            const ghSynced = await pushToGithub(githubPath, codeContent, `Update ${githubPath} via Reply`, sha);

            const statusMsg = 
                `✦━━ ❪ ⚙️ COMMAND SAVED ❫ ━━✦\n\n` +
                `📁 File: models/commands/${fileName}\n` +
                `⚡ Active Load: ${loaded ? 'SUCCESS ✅' : 'SYNTAX ERR ⚠️'}\n` +
                `☁️ GitHub Sync: ${ghSynced ? 'SUCCESS ✅' : 'PENDING ⚠️'}\n\n` +
                `👑 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐇𝐌𝐀𝐃 𝐑𝐃𝐗`;

            return api.sendMessage(statusMsg, threadID, messageID);
        }

        if (fs.existsSync(localFilePath)) {
            const oldCode = await fs.readFile(localFilePath, 'utf8');
            return api.sendMessage(`📜 Code for "${fileName}":\n\n\`\`\`javascript\n${oldCode}\n\`\`\``, threadID, messageID);
        }

        return api.sendMessage(`❌ Safe Reply Method: Pehle sirf code bhejain, phir us par reply karke '.editcmd ${fileNameOnly}' likhein.`, threadID, messageID);

    } catch (err) {
        return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
};
        
