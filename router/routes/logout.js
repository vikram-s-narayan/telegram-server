var express = require('express');
var db = require('../../db');
var User = db.model('User');
var log = require('../../log')
var router = express.Router();

router.post('/', function(req, res) {
  log.info('user logged out: ', req.user.id);
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
