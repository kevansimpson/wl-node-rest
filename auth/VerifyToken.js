var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
  var token = req.headers['authorization'] || req.headers['x-access-token'];

  console.log('TOKEN => ' + token);
//  if (!token)
//    return res.status(403).send({ auth: false, message: 'No token provided' });
//
//  token = token.replace('Bearer ', '');
//  jwt.verify(token, new Buffer(config.secret, 'base64'), function(err, decoded) {
//    if (err) {
//      console.log(err);
//      return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
//    }
//
//    req.userId = decoded.id;
//    next();
//  });
  next();
}

module.exports = verifyToken;