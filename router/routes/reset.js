var express = require('express');
var db = require('../../db');
var router = express.Router();

router.post('/', function(req, res) {
  console.log("reset password button clicked");
});

module.exports = router;
