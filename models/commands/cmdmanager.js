/**
 * Universal Command & Event Manager (.editcmd / .editevt)
 * Path: models/commands/cmdmanager.js
 * Target Paths:
 *   - Commands: models/commands/
 *   - Events: models/events/
 * Target Repo: Ahmad030687/Shaan-bot
 * Credits: SARDAR RDX (Strictly preserved)
 * Upgraded & Powered by: AHMAD RDX
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const commandsDir = path.join(__dirname);
const eventsDir = path.join(__dirname, '..', 'events');

// GitHub Sync Credentials (Read from Render Environment Variable)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'Ahmad030687/Shaan-bot';
const GITHUB_BRANCH = 'main';

async function pushToGithub(filePathInRepo, content, commitMessage, sha = null) {
    if (!GITHUB_TOKEN) {
        console.warn('[AHMAD RDX Sync]: GITHUB_TOKEN environment variable is missing.');
        return false;
    }

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
        console.error('[AHMAD RDX GitHub Sync Error]:', e.response?.data || e.message);
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
        global.client.handleEvent = global.client.handleEvent || [];

        if (pull.config && pull.config.name) {
            const cmdName = pull.config.name.toLowerCase();
            global.client.commands.set(cmdName, pull);

            if (pull.config.aliases && Array.isArray(pull.config.aliases)) {
                pull.config.aliases.forEach(alias => {
                    global.client.aliases.set(alias.toLowerCase(), cmdName);
                });
            }

            if (typeof pull.handleEvent === 'function') {
                global.client.handleEvent = global.client.handleEvent.filter(item => item.config.name !== pull.config.name);
                global.client.handleEvent.push(pull);
            }
            return true;
        }
    } catch (err) {
        console.error('[AHMAD RDX Command Load Error]:', err.message);
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

module.exports = {
    config: {
        name: 'cmdmanager',
        aliases: ['addcmd', 'editcmd', 'cmd', 'load', 'editevt', 'addevt', 'evt'],
        version: '3.0.0',
        permission: 2,
        credits: 'SARDAR RDX', // Strict core credit preserved
        description: 'Direct Add, Edit & Reload Commands & Events in models/ by AHMAD RDX',
        commandCategory: 'system',
        cooldowns: 2
    },

    async run({ api, event, args }) {
        const { threadID, messageID, body, type, messageReply } = event;
        const cleanBody = body.trim();
        const firstWord = cleanBody.split(/\s+/)[0].toLowerCase();

        // Detect mode: Check if user called event aliases or passed flag
        const isEventMode = ['editevt', 'addevt', 'evt'].some(alias => firstWord.includes(alias)) || args[0]?.toLowerCase() === '-e';

        if (isEventMode && args[0]?.toLowerCase() === '-e') {
            args.shift(); // Remove flag if present
        }

        const targetType = isEventMode ? 'Event' : 'Command';
        const targetDir = isEventMode ? eventsDir : commandsDir;
        const repoSubDir = isEventMode ? 'models/events' : 'models/commands';

        const input = args[0] ? args[0].toLowerCase().trim() : '';

        // Ensure events folder exists
        if (!fs.existsSync(eventsDir)) {
            fs.mkdirSync(eventsDir, { recursive: true });
        }

        // -------------------------------------------------------------
        // METHOD 1: Direct Code Paste (.editcmd / .editevt filename <code>)
        // -------------------------------------------------------------
        if (args.length >= 2) {
            const fileNameOnly = input.endsWith('.js') ? input.slice(0, -3) : input;
            const fileName = `${fileNameOnly}.js`;
            const localFilePath = path.join(targetDir, fileName);
            const githubPath = `${repoSubDir}/${fileName}`;

            const codeContent = cleanBody.substring(cleanBody.indexOf(args[1])).trim();

            try {
                await fs.writeFile(localFilePath, codeContent, 'utf8');
                const loaded = isEventMode ? registerEventToBot(localFilePath) : registerCommandToBot(localFilePath);

                if (!loaded) {
                    const syntaxErr = 
                        "╔════════════════════════╗\n" +
                        "║ ⚠️ SYNTAX LOAD ERROR   ║\n" +
                        "╚════════════════════════╝\n\n" +
                        `❌ Code mein syntax error hai! ${targetType} "${fileName}" active memory mein load nahi ho saka.\n\n` +
                        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                        "👑 SYSTEM OWNER: AHMAD RDX";
                    return api.sendMessage(syntaxErr, threadID, messageID);
                }

                const sha = await getGithubFileSha(githubPath);
                const ghSynced = await pushToGithub(githubPath, codeContent, `Update ${githubPath} via AHMAD RDX Engine`, sha);

                const statusMsg = 
                    "╔════════════════════════╗\n" +
                    `║ ⚙️ ${targetType.toUpperCase()} ENGINE OK  ║\n` +
                    "╚════════════════════════╝\n\n" +
                    `📁 Target File: ${repoSubDir}/${fileName}\n` +
                    `⚡ Active RAM Load: SUCCESS\n` +
                    `☁️ GitHub Sync: ${ghSynced ? "SUCCESS ✅" : "PENDING/SKIPPED ⚠️"}\n\n` +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "👑 SYSTEM OWNER: AHMAD RDX\n" +
                    "📱 WhatsApp: +92306*******\n" +
                    "✈️ Telegram: ahmadalisafdar3\n" +
                    "✨ Credits: SARDAR RDX\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

                return api.sendMessage(statusMsg, threadID, messageID);

            } catch (err) {
                return api.sendMessage(`❌ [ AHMAD RDX ENGINE ERROR ]: ${err.message}`, threadID, messageID);
            }
        }

        // -------------------------------------------------------------
        // METHOD 2: Message Reply Method (.editcmd / .editevt filename reply)
        // -------------------------------------------------------------
        if (type === 'message_reply' && messageReply && messageReply.body && input) {
            const fileNameOnly = input.endsWith('.js') ? input.slice(0, -3) : input;
            const fileName = `${fileNameOnly}.js`;
            const localFilePath = path.join(targetDir, fileName);
            const githubPath = `${repoSubDir}/${fileName}`;
            const codeContent = messageReply.body.trim();

            try {
                await fs.writeFile(localFilePath, codeContent, 'utf8');
                if (isEventMode) {
                    registerEventToBot(localFilePath);
                } else {
                    registerCommandToBot(localFilePath);
                }

                const sha = await getGithubFileSha(githubPath);
                const ghSynced = await pushToGithub(githubPath, codeContent, `Save ${githubPath} via Reply Engine`, sha);

                const replyStatus = 
                    "╔════════════════════════╗\n" +
                    "║  📥 REPLY SAVED & LOAD ║\n" +
                    "╚════════════════════════╝\n\n" +
                    `📁 ${targetType} "${fileName}" reply se save aur RAM mein active kar diya gaya hai!\n` +
                    `📂 Path: ${repoSubDir}/${fileName}\n` +
                    `☁️ GitHub Repo Sync: ${ghSynced ? "SUCCESS ✅" : "PENDING ⚠️"}\n\n` +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "👑 SYSTEM OWNER: AHMAD RDX\n" +
                    "📱 WhatsApp: +92306*******\n" +
                    "✈️ Telegram: ahmadalisafdar3";

                return api.sendMessage(replyStatus, threadID, messageID);
            } catch (err) {
                return api.sendMessage(`❌ [ AHMAD RDX REPLY ERROR ]: ${err.message}`, threadID, messageID);
            }
        }

        // -------------------------------------------------------------
        // METHOD 3: Direct Read Existing Code (.editcmd / .editevt filename)
        // -------------------------------------------------------------
        if (input && args.length === 1) {
            const fileNameOnly = input.endsWith('.js') ? input.slice(0, -3) : input;
            const fileName = `${fileNameOnly}.js`;
            const localFilePath = path.join(targetDir, fileName);

            if (!fs.existsSync(localFilePath)) {
                return api.sendMessage(`❌ File "${repoSubDir}/${fileName}" local directory mein nahi mili.`, threadID, messageID);
            }

            try {
                const oldCode = await fs.readFile(localFilePath, 'utf8');
                const readHeader = 
                    "╔════════════════════════╗\n" +
                    "║  📜 SOURCE CODE VIEWER  ║\n" +
                    "╚════════════════════════╝\n\n" +
                    `📄 File: ${repoSubDir}/${fileName}\n\n` +
                    "```javascript\n" +
                    oldCode + "\n" +
                    "```\n\n" +
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                    "👑 POWERED BY: AHMAD RDX";

                return api.sendMessage(readHeader, threadID, messageID);
            } catch (err) {
                return api.sendMessage(`❌ Read Error: ${err.message}`, threadID, messageID);
            }
        }

        // Usage Guide Panel
        const usageGuide = 
            "╔════════════════════════╗\n" +
            "║ 💡 ENGINE USAGE GUIDE  ║\n" +
            "╚════════════════════════╝\n\n" +
            "🔹 COMMANDS MANAGER (models/commands/):\n" +
            "1️⃣ .editcmd <cmd_name> <POORA_CODE>\n" +
            "2️⃣ Reply with: .editcmd <cmd_name>\n" +
            "3️⃣ .editcmd <cmd_name> (View code)\n\n" +
            "🔹 EVENTS MANAGER (models/events/):\n" +
            "1️⃣ .editevt <event_name> <POORA_CODE>\n" +
            "2️⃣ Reply with: .editevt <event_name>\n" +
            "3️⃣ .editevt <event_name> (View code)\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "👑 SYSTEM OWNER: AHMAD RDX\n" +
            "📱 WhatsApp: +92306*******\n" +
            "✈️ Telegram: ahmadalisafdar3";

        return api.sendMessage(usageGuide, threadID, messageID);
    }
};
                                            
