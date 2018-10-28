var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ strict: false }));

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

const JMS_PSWD = process.env.JMS_PSWD;
const JMS_USER = process.env.JMS_USER;

router.post('/login', function(req, res) {
  var passwordIsValid = bcrypt.compareSync(req.body.password, JMS_PSWD);
  if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

  var token = jwt.sign({ id: JMS_USER }, config.secret, { expiresIn: 864000 });
  res.status(200).send({ auth: true, token: token});
});

router.get('/encrypt/:text', function (req, res) {
  res.status(200).send(encrypt(req.params.text));
});

function encrypt(str) {
  return bcrypt.hashSync(str);
}

module.exports = router;
