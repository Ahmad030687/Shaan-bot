const { spawn } = require("child_process");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.send("<h1>AHMAD RDX BOT IS ACTIVE & RUNNING SMOOTHLY 🚀</h1>");
});

app.listen(port, '0.0.0.0', () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    logger(`Server error: ${err.message}`, "[ Error ]");
});

global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Shaan-Khan-K.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 10) {
            global.countRestart += 1;
            logger(`Bot process exited with code ${codeExit}. Auto-healing restart (${global.countRestart}/10)...`, "[ Auto-Restart ]");
            setTimeout(() => startBot(), 3000);
        } else {
            logger(`Bot process stopped after multiple restarts.`, "[ Stopped ]");
        }
    });

    child.on("error", (error) => {
        logger(`Process Error: ${JSON.stringify(error)}`, "[ Error ]");
    });
}

startBot();
