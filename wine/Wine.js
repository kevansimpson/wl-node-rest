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
  connection.query('SELECT * FROM jmswines.wine ORDER BY producer, name, type, year ', function (error, results, fields) {
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
  connection.query('SELECT * FROM jmswines.wine WHERE id = ?', [req.params.wineId], function (error, result, fields) {
    if (error) {
      console.log("Query failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not get wine', id: req.params.wineId });
    } else {
      // connected!
      if (result && result[0]) {
        console.log('Sending single result back!');
        connection.end(function (err) { res.status(200).json(result[0]) });
      } else {
        connection.end(function (err) { res.status(404).json({}) });
      }
    }
  });
})

// Create Wine endpoint
router.post('/', VerifyToken, function (req, res) {
  // assigns multiple constants
//  const { wineId, name } = req.body;
  var connection = createConnection();
  connection.query('INSERT INTO jmswines.wine ' +
                   '(producer, name, type, year, price, qty, bin, ready, rating) ' +
                   'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                   [req.body.producer, req.body.name, req.body.type, req.body.year, req.body.price, req.body.qty,
                    req.body.bin, req.body.ready, req.body.rating], function (error, result) {
    if (error) {
      console.log("Insert failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not insert wine' });
    } else {
      // connected!
      console.log(result.affectedRows + " record(s) inserted");
      connection.end(function (err) { res.status(200).json(result);});
    }
  })
})

// Update Wine endpoint
router.put('/:wineId', VerifyToken, function (req, res) {
  var connection = createConnection();
  connection.query('UPDATE jmswines.wine SET ' +
                   'producer = ?, name = ?, type = ?, year = ?, price = ?, qty = ?, ' +
                   'bin = ?, ready = ?, rating = ? WHERE id = ?',
                   [req.body.producer, req.body.name, req.body.type, req.body.year, req.body.price, req.body.qty,
                    req.body.bin, req.body.ready, req.body.rating, req.params.wineId], function (error, result) {
    if (error) {
      console.log("Update failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not update wine', id: req.body.wineId });
    } else {
      // connected!
      console.log(result.affectedRows + " record(s) updated");
      connection.end(function (err) { res.status(200).json(result);});
    }
  })
})

// Delete Wine endpoint
router.delete('/:wineId', VerifyToken, function (req, res) {
  var connection = createConnection();
  connection.query('DELETE FROM jmswines.wine WHERE id = ?', [req.params.wineId], function (error, result) {
    if (error) {
      console.log("Delete failed, closing connection");
      connection.destroy();
      console.log(error);
      res.status(503).json({ error: 'Could not delete wine', id: req.body.wineId });
    } else {
      // connected!
      console.log(result.affectedRows + " record(s) deleted");
      connection.end(function (err) { res.status(200).json(result);});
    }
  })
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
