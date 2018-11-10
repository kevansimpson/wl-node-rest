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
  if (JMS_USER !== req.body.username) {
    console.log('Username mismatch!')
    return res.status(401).send({ auth: false, token: null });
  }

  var passwordIsValid = bcrypt.compareSync(req.body.password, JMS_PSWD);
  if (!passwordIsValid) {
    console.log('Password mismatch!')
    return res.status(401).send({ auth: false, token: null });
  }

  var token = jwt.sign({ id: JMS_USER }, new Buffer(config.secret, 'base64'), { expiresIn: 86400 });
  console.log('TOKEN => ' + token);
//  var decoded = jwt.verify(token, new Buffer(config.secret, 'base64'));
  var decoded = jwt.decode(token);
  console.log('FOOD  => ' + JSON.stringify(decoded));
//  res.status(200).send({ auth: true, token: token});
    res.status(200)
       .cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true, secure: true })
       .send({ auth: true });
});

router.get('/encrypt/:text', function (req, res) {
  res.status(200).send(encrypt(req.params.text));
});

function encrypt(str) {
  return bcrypt.hashSync(str);
}

module.exports = router;
