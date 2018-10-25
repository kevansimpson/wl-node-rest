const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');

const WRDB_BASE = process.env.RDS_HOST;
const WRDB_USER = process.env.RDS_USER;
const WRDB_PSWD = process.env.RDS_PSWD;

// grabs offline flag from offline plugin when it starts
const IS_OFFLINE = process.env.IS_OFFLINE;
if (IS_OFFLINE === 'true') {
  console.log('Running app offline...');
} else {
  console.log('App starting serverless...')
};

const fs = require('fs');
const mysql = require('mysql');

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello Wine Enthusiast!')
})

// Get Wine endpoint
app.get('/wines', function (req, res) {
  var connection = createConnection();
  connection.query('select * from jmswines.wine', function (error, results, fields) {
    if (error) {
      console.log("Query failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not get winelist' });
    } else {
      // connected!
      console.log('Sending results back!');
      connection.end(function (err) { res.status(200).json(results);});
    }
  });
})


// Get Wine endpoint
app.get('/wines/:wineId', function (req, res) {
  var connection = createConnection();
  connection.query('select * from jmswines.wine where id = ?', [req.params.wineId], function (error, result, fields) {
    if (error) {
      console.log("Query failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not get wine', id: req.params.wineId });
    } else {
      // connected!
      console.log('Sending single result back!');
      connection.end(function (err) { res.status(200).json(result);});
    }
  });
})

// Create Wine endpoint
app.post('/wines', function (req, res) {
  // assigns multiple constants
  const { wineId, name } = req.body;
  res.status(404).json({ error: 'Could not create wine' });
})

function createConnection() {
  console.log('Attempting connection')
  var connection = mysql.createConnection({
    host: WRDB_BASE,
    user: WRDB_USER,
    password: WRDB_PSWD,
    database: "jmswines",
    ssl: {
      ca: fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem')
    }
  });

  if (IS_OFFLINE === 'true') {
    console.log(connection);
  }

  return connection;
}

module.exports.handler = serverless(app);