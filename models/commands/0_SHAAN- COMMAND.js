/**
 * Module: CMD (System Command & Module Manager)
 * Path: Sardar/commands/cmd.js
 * Credits: SHAAN-BABU (Strictly preserved)
 * Upgraded & Branded by: AHMAD RDX
 */

module.exports.config = {
    name: "cmd",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "SHAAN-BABU", // Strict core credit preserved
    description: "Manage, control, load, and unload all bot modules dynamically",
    commandCategory: "System",
    usages: "[load/unload/loadAll/unloadAll/info/count] [module_name]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { execSync } = global.nodemodule['child_process'];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    delete require['resolve'][require['resolve'](configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');

    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('[ AHMAD RDX ] - Module is improperly formatted!');

            global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);

            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];

                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0, loadSuccess = ![], error;
                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);

                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                            global.nodemodule[packageName] = require(packageName);
                        else 
                            global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('[ AHMAD RDX ] - Package missing: ' + packageName + ' for command ' + command.config.name + '. Auto-installing...', 'warn');
                        const insPack = {
                            stdio: 'inherit',
                            env: process.env,
                            shell: !![],
                            cwd: join(global.client.mainPath, 'nodemodules')
                        };

                        execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);

                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require['cache'] = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                                    global.nodemodule[packageName] = require(packageName);
                                else 
                                    global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = !![];
                                break;
                            } catch (erorr) {
                                error = erorr;
                            }
                            if (loadSuccess || !error) break;
                        }
                        if (!loadSuccess || error) throw 'Failed to install dependency ' + packageName + ' for command ' + command.config.name;
                    }
                }
                logger.loader('[ AHMAD RDX ] - Loaded all required packages for: ' + command.config.name);
            }

            if (command.config.envConfig && typeof command.config.envConfig == 'object') {
                try {
                    for (const [key, value] of Object['entries'](command.config.envConfig)) {
                        if (typeof global.configModule[command.config.name] == undefined) 
                            global.configModule[command.config.name] = {};
                        if (typeof configValue[command.config.name] == undefined) 
                            configValue[command.config.name] = {};
                        if (typeof configValue[command.config.name][key] !== undefined) 
                            global.configModule[command.config.name][key] = configValue[command.config.name][key];
                        else 
                            global.configModule[command.config.name][key] = value || '';
                        if (typeof configValue[command.config.name][key] == undefined) 
                            configValue[command.config.name][key] = value || '';
                    }
                    logger.loader('Loaded config: ' + command.config.name);
                } catch (error) {
                    throw new Error('[ AHMAD RDX ] » Could not load config module: ' + JSON.stringify(error));
                }
            }

            if (command['onLoad']) {
                try {
                    const onLoads = { configValue };
                    command['onLoad'](onLoads);
                } catch (error) {
                    throw new Error('[ AHMAD RDX ] » Unable to execute onLoad: ' + JSON.stringify(error), 'error');
                }
            }

            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);

            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1));

            global.client.commands.set(command.config.name, command);
            logger.loader('Loaded command: ' + command.config.name);
        } catch (error) {
            errorList.push('• ' + nameModule + ' ❌ Exception: ' + error.message);
        }
    }

    if (errorList.length != 0) {
        api.sendMessage(
            "╔════════════════════════╗\n" +
            "║ ⚠️ LOAD ERROR REPORT  ║\n" +
            "╚════════════════════════╝\n\n" +
            errorList.join('\n') + "\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "👑 POWERED BY: AHMAD RDX", threadID, messageID);
    }

    const successCount = moduleList.length - errorList.length;
    const msg = 
        "╔════════════════════════╗\n" +
        "║  ⚡ MODULE LOAD SUCCESS  ║\n" +
        "╚════════════════════════╝\n\n" +
        `✅ Successfully loaded: ${successCount} module(s)\n` +
        `📦 Modules: [ ${moduleList.join(', ')}.js ]\n\n` +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 SYSTEM OWNER: AHMAD RDX\n" +
        "📱 WhatsApp: +92306*******\n" +
        "✈️ Telegram: ahmadalisafdar3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    api.sendMessage(msg, threadID, messageID);
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + '.temp');
    return;
};

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Unloaded command ${nameModule}!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");

    const msg = 
        "╔════════════════════════╗\n" +
        "║  🛑 MODULE UNLOAD SUCCESS║\n" +
        "╚════════════════════════╝\n\n" +
        `🚫 Successfully disabled: ${moduleList.length} module(s)\n` +
        `📂 Modules: [ ${moduleList.join(', ')}.js ]\n\n` +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👑 SYSTEM OWNER: AHMAD RDX\n" +
        "📱 WhatsApp: +92306*******\n" +
        "✈️ Telegram: ahmadalisafdar3\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

    return api.sendMessage(msg, threadID, messageID);
};

module.exports.run = function ({ event, args, api }) {
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.slice(1);

    switch (args[0]) {
        case "count": {
            const count = global.client.commands.size;
            const msg = 
                "╔════════════════════════╗\n" +
                "║ 📊 ACTIVE COMMANDS COUNT ║\n" +
                "╚════════════════════════╝\n\n" +
                `⚡ Total Active Commands: ${count}\n\n` +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "👑 POWERED BY: AHMAD RDX\n" +
                "📱 WhatsApp: +92306*******";
            api.sendMessage(msg, threadID, messageID);
            break;
        }
        case "load": {
            if (moduleList.length == 0) 
                return api.sendMessage("⚠️ [ AHMAD RDX ] Please specify the module name to load!", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unload": {
            if (moduleList.length == 0) 
                return api.sendMessage("⚠️ [ AHMAD RDX ] Please specify the module name to unload!", threadID, messageID);
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("cmd"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "info": {
            const command = global.client.commands.get(moduleList.join("") || "");

            if (!command) 
                return api.sendMessage("❌ [ AHMAD RDX ] Specified module does not exist!", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            const permText = (hasPermssion == 0) ? "Everyone (User)" : (hasPermssion == 1) ? "Group Admin" : "Bot Admin / Boss";

            const msg = 
                "╔════════════════════════╗\n" +
                `║ 📌 MODULE DETAILS: ${name.toUpperCase()} ║\n` +
                "╚════════════════════════╝\n\n" +
                `🏷️ Version: ${version}\n` +
                `🛡️ Required Permission: ${permText}\n` +
                `⏱️ Cooldown: ${cooldowns} second(s)\n` +
                `📦 Required Packages: ${Object.keys(dependencies || {}).join(", ") || "None"}\n\n` +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "👑 OWNER: AHMAD RDX\n" +
                "📱 WhatsApp: +92306*******\n" +
                "✈️ Telegram: ahmadalisafdar3\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

            return api.sendMessage(msg, threadID, messageID);
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
};
				
