const crypto = require('crypto');
const fs = require('fs');
const execSync = require('child_process').execSync;
const express = require('express');
const PF_VERSION = require('./node_modules/@polyflow/sdk/package.json').version;

const app = express();
const port = 5555

const buildFolder = __dirname + "/public/build/";
const tempFolder = __dirname + "/public/temp/";

const API_KEY_ID = `"API_KEY"`;
const injectorTemplate = fs.readFileSync(__dirname + "/scripts/injector-template.js", "utf-8");

app.get('/', async (req, res) => {
    res.send({
        sdk: PF_VERSION 
    });
});

app.get('/generate', async (req, res) => {
    const api = req.query.api;
    const logEnabled = req.query.logEnabled;
    const stagingEnabled = req.query.stagingEnabled;

    if (!api) {
        res.status(400);
        return;
    }

    const params = `"${api}", { logEnabled: ${logEnabled}, stagingModeEnabled: ${stagingEnabled} }`;

    const fileName = crypto.createHash("sha256").update(params + PF_VERSION).digest("hex") + ".js";
    const buildPath = buildFolder + fileName;
    const buildExists = fs.existsSync(buildPath);
    
    if (!buildExists) {
        const tempPath = tempFolder + fileName;
        fs.writeFileSync(tempFolder + fileName, injectorTemplate.replace(API_KEY_ID, params));
        execSync(`npx browserify ${tempPath} -p esmify | npx uglifyjs > ${buildPath}`);
    }
    
    res.sendFile(buildPath);
});

app.listen(port, () => {
    console.log(`Polyflow SDK builder listening at ${port}`);
});
