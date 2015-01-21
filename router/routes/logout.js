var express = require('express');
var db = require('../../db');
var User = db.model('User');
var router = express.Router();

router.post('', function(req, res) {
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
