const fs = require('fs');
const express = require('express');
const logger = require('morgan');
const PF_VERSION = require('./node_modules/@polyflow/sdk/package.json').version;

const app = express();
const port = 5555

const API_KEY_ID = `"API_KEY"`;
const BUILD = fs.readFileSync(__dirname + "/dist/polyflow-bundle.js", "utf-8");

app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', { flags: 'a' })
}));
app.use(logger('common'));

app.get('/', async (req, res) => {
    res.send({
        sdk: PF_VERSION 
    });
});

app.get('/generate', async (req,res) => {
    const api = req.query.api;
    const logEnabled = req.query.logEnabled ?? false;
    const stagingEnabled = req.query.stagingEnabled ?? false;

    if (!api) {
        res.status(400);
        res.send("Missing API key!");
        return;
    }

    res.setHeader("Content-Type", "application/javascript");
    res.send(
        BUILD.replace(
            API_KEY_ID,
            `"${api}", { logEnabled: ${logEnabled}, stagingModeEnabled: ${stagingEnabled} }`
        )
    );
});

app.listen(port, () => {
    console.log(`Polyflow SDK builder listening at ${port}`);
});
