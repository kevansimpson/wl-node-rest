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

app.get('/', function (req, res) {
  res.send('Hello Wine Enthusiast!')
})

var WineController = require('./wine/Wine.js');
app.use('/wines', WineController);

module.exports.handler = serverless(app);