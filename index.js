const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// grabs offline flag from offline plugin when it starts
const IS_OFFLINE = process.env.IS_OFFLINE;
if (IS_OFFLINE === 'true') {
  console.log('Running app offline...');
} else {
  console.log('App starting serverless...')
};

app.use(bodyParser.json({ strict: false }));

app.get('/hello', function (req, res) {
  res.send('Hello Wine Enthusiast!')
})

global.__root = __dirname + '/';

var WineController = require(__root + 'wine/Wine.js');
app.use('/wines', WineController);

var AuthController = require(__root + 'auth/AuthController.js');
app.use('/auth', AuthController);

module.exports.handler = serverless(app);