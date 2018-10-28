var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ strict: false }));

const WRDB_BASE = process.env.RDS_HOST;
const WRDB_USER = process.env.RDS_USER;
const WRDB_PSWD = process.env.RDS_PSWD;

const fs = require('fs');
const mysql = require('mysql');

// Get All Wines endpoint
router.get('/', VerifyToken, function (req, res) {
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

router.get('/:wineId', VerifyToken, function (req, res) {
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
router.post('/', VerifyToken, function (req, res) {
  // assigns multiple constants
  const { wineId, name } = req.body;
  res.status(404).json({ error: 'Could not create wine' });
})

function createConnection() {
  console.log('Attempting connection...');
  var connection = mysql.createConnection({
    host: WRDB_BASE,
    user: WRDB_USER,
    password: WRDB_PSWD,
    database: "jmswines",
    ssl: {
      ca: fs.readFileSync(__dirname + '/rds-combined-ca-bundle.pem')
    }
  });
  console.log('Connection acquired!');
//  console.log(connection);

  return connection;
}

module.exports = router;
