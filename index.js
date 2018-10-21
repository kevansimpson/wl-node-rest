const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const WINES_TABLE = process.env.WINES_TABLE;

// grabs offline flag from offline plugin when it starts
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello Wine Enthusiast!')
})

// Get Wine endpoint
app.get('/wines/:wineId', function (req, res) {
  const params = {
    TableName: WINES_TABLE,
    Key: {
      wineId: req.params.wineId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get wine' });
    }
    if (result.Item) {
      const {wineId, name} = result.Item;
      res.json({ wineId, name });
    } else {
      res.status(404).json({ error: "Wine not found" });
    }
  });
})

// Create Wine endpoint
app.post('/wines', function (req, res) {
  const { wineId, name } = req.body;
  if (typeof wineId !== 'string') {
    res.status(400).json({ error: '"wineId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: WINES_TABLE,
    Item: {
      wineId: wineId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create wine' });
    }
    res.json({ wineId, name });
  });
})

module.exports.handler = serverless(app);