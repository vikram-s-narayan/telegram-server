//get express, router, passport etc.
var account = require('./account');
var graph = require('./graph');
var express = require('express');
var router = express.Router();
var db = require('../../../db');
var User = db.model('User');

router.post('/', function (req, res, next) {
  var operation = req.body.user.meta.operation;

  switch (operation) {
    case 'login':
      return account.login(req, res);
    case 'signup':
      return account.signup(req, res);
    case 'passwordReset':
      return account.passwordReset(req, res);
    default:
      logger.error('unknown operation');
      return res.sendStatus(400); //bad request
  }
});

router.get('/', function(req, res, next) {
  var operation = req.query.operation;

 switch (operation) {
   case 'isAuthenticated':
     return account.isAuthenticated(req, res);
   case 'getFollowers':
     return graph.getFollowers(req, res);
   case 'getFollowing':
     return graph.getFollowing(req, res);
   default:
       logger.error('unknown operation');
       return res.sendStatus(400); //bad request
 }
});


router.get('/:userid', function(req, res) {
  var id = req.params.userid;
  User.findOne({id: id}, function(err, user){
    if (err) {
      return res.sendStatus(500);
    }

    if (!user){
      return res.sendStatus(404);
    }

    console.log("returning in :userid ...", user.toEmber());
    return res.send({user: user.toEmber()});//8
  });
});

exports = module.exports = router;
