const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("fca-priyansh"); 
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies || {};
const listbuiltinModules = require("module").builtinModules;

global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
    getTime: function (option) {
        switch (option) {
            case "seconds": return `${moment.tz("Asia/Karachi").format("ss")}`;
            case "minutes": return `${moment.tz("Asia/Karachi").format("mm")}`;
            case "hours": return `${moment.tz("Asia/Karachi").format("HH")}`;
            case "date": return `${moment.tz("Asia/Karachi").format("DD")}`;
            case "month": return `${moment.tz("Asia/Karachi").format("MM")}`;
            case "year": return `${moment.tz("Asia/Karachi").format("YYYY")}`;
            case "fullHour": return `${moment.tz("Asia/Karachi").format("HH:mm:ss")}`;
            case "fullYear": return `${moment.tz("Asia/Karachi").format("DD/MM/YYYY")}`;
            case "fullTime": return `${moment.tz("Asia/Karachi").format("HH:mm:ss DD/MM/YYYY")}`;
        }
    }
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");
global.nodemodule = new Object();
global.config = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
    logger.loader("Found file config: config.json");
} catch {
    if (existsSync(global.client.configPath.replace(/\.json/g, "") + ".temp")) {
        configValue = JSON.parse(readFileSync(global.client.configPath.replace(/\.json/g, "") + ".temp"));
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g, "") + ".temp"}`);
    } else {
        return logger.loader("config.json not found!", "error");
    }
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Loaded!");
} catch {
    return logger.loader("Can't load file config!", "error");
}

const { Sequelize, sequelize } = require("./includes/database");
writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') !== 0 && item !== '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] === "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
};

var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
var appState;
try {
    appState = require(appStateFile);
    logger.loader(global.getText("priyansh", "foundPathAppstate"));
} catch {
    return logger.loader(global.getText("priyansh", "notFoundPathAppstate"), "error");
}

function onBot({ models: botModel }) {
    const loginData = { appState };
    
    // Humanized FCA Options to Prevent Logout in Kiwi Browser Sessions
    const fcaOptions = Object.assign({
        logLevel: "silent",
        forceLogin: true,
        listenEvents: true,
        selfListen: false,
        autoMarkDelivery: true,
        autoMarkRead: false,
        listenTyping: false,
        userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 Kiwi Browser"
    }, global.config.FCAOption || {});

    login(loginData, async (loginError, loginApiData) => {
        if (loginError) {
            logger(`Login Error: ${JSON.stringify(loginError)}`, `ERROR`);
            return;
        }

        loginApiData.setOptions(fcaOptions);
        
        // Anti-Logout State Persistence Sync
        try {
            const freshState = loginApiData.getAppState();
            writeFileSync(appStateFile, JSON.stringify(freshState, null, '\x09'), 'utf8');
        } catch (e) {
            logger("Failed to auto-save appstate", "WARN");
        }

        global.client.api = loginApiData;
        global.config.version = '1.3.0';
        global.client.timeStart = Date.now();

        // Load Commands
        const listCommand = readdirSync(global.client.mainPath + '/models/commands')
            .filter(command => command.endsWith('.js') && !command.includes('example') && !(global.config.commandDisabled || []).includes(command));

        for (const command of listCommand) {
            try {
                var module = require(global.client.mainPath + '/models/commands/' + command);
                if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('priyansh', 'errorFormat'));
                if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('priyansh', 'nameExist'));
                if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                global.client.commands.set(module.config.name, module);
                logger.loader(global.getText('priyansh', 'successLoadModule', module.config.name));
            } catch (error) {
                logger.loader(global.getText('priyansh', 'failLoadModule', command, error), 'error');
            }
        }

        // Load Events
        const events = readdirSync(global.client.mainPath + '/models/events')
            .filter(event => event.endsWith('.js') && !(global.config.eventDisabled || []).includes(event));

        for (const ev of events) {
            try {
                var eventModule = require(global.client.mainPath + '/models/events/' + ev);
                if (!eventModule.config || !eventModule.run) throw new Error(global.getText('priyansh', 'errorFormat'));
                if (global.client.events.has(eventModule.config.name || '')) throw new Error(global.getText('priyansh', 'nameExist'));
                global.client.events.set(eventModule.config.name, eventModule);
                logger.loader(global.getText('priyansh', 'successLoadModule', eventModule.config.name));
            } catch (error) {
                logger.loader(global.getText('priyansh', 'failLoadModule', ev, error), 'error');
            }
        }

        logger.loader(global.getText('priyansh', 'finishLoadModule', global.client.commands.size, global.client.events.size));
        
        if (existsSync(global.client.configPath + '.temp')) {
            unlinkSync(global.client.configPath + '.temp');
        }

        const listenerData = { api: loginApiData, models: botModel };
        const listener = require('./includes/listen')(listenerData);

        function startListening() {
            global.handleListen = loginApiData.listenMqtt((error, message) => {
                if (error) {
                    logger(global.getText('priyansh', 'handleListenError', JSON.stringify(error)), 'error');
                    return;
                }
                if (['presence', 'typ', 'read_receipt'].includes(message.type)) return;
                
                // Periodic Session Refresh on Incoming Message
                try {
                    const currentState = loginApiData.getAppState();
                    writeFileSync(appStateFile, JSON.stringify(currentState, null, '\x09'), 'utf8');
                } catch (e) {}

                return listener(message);
            });
        }

        startListening();
    });
}

(async () => {
    try {
        await sequelize.authenticate();
        const authentication = { Sequelize, sequelize };
        const models = require('./includes/database/model')(authentication);
        logger(global.getText('priyansh', 'successConnectDatabase'), '[ DATABASE ]');
        onBot({ models });
    } catch (error) { 
        logger(global.getText('priyansh', 'successConnectDatabase', JSON.stringify(error)), '[ DATABASE ]'); 
    }
})();

process.on('unhandledRejection', (err) => {
    logger(`Unhandled Rejection: ${err?.message || err}`, '[ SYSTEM WARN ]');
});
