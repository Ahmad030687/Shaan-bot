module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;
        const { handleReply, commands } = global.client;
        const { messageID, threadID, messageReply } = event;

        if (handleReply && handleReply.length !== 0) {
            const indexOfHandle = handleReply.findIndex(e => e.messageID == messageReply.messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReply[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            if (!handleNeedExec) return api.sendMessage(global.getText('handleReply', 'missingValue'), threadID, messageID);

            try {
                var getText2 = () => {};
                if (handleNeedExec.languages && typeof handleNeedExec.languages === 'object') {
                    getText2 = (...value) => {
                        var lang = handleNeedExec.languages[global.config.language]?.[value[0]] || '';
                        for (var i = value.length - 1; i >= 0; i--) {
                            const expReg = RegExp('%' + (i + 1), 'g');
                            lang = lang.replace(expReg, value[i]);
                        }
                        return lang;
                    };
                }

                const Obj = {
                    api,
                    event,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    handleReply: indexOfMessage,
                    getText: getText2
                };

                if (typeof handleNeedExec.handleReply === 'function') {
                    handleNeedExec.handleReply(Obj);
                }
            } catch (error) {
                return api.sendMessage(global.getText('handleReply', 'executeError', error), threadID, messageID);
            }
        }
    };
};
