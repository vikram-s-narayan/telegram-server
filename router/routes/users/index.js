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
  var currentUser = req.query.currentUser;

 switch (operation) {
   case 'isAuthenticated':
     return account.isAuthenticated(req, res);
   case 'getFollowers':
     return graph.getFollowers(req, res, currentUser);
   case 'getFollowing':
     return graph.getFollowing(req, res, currentUser);
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


    return res.send({user: user.toEmber(req.user)});
  });
});


router.put('/:userid', function(req, res){
  var operation = req.body.user.meta.operation;
  if(operation==='follow') {
  console.log("follow request received");
  var userToFollow = req.body.user.meta.following;

  var userId = req.params.userid;
  var query = {"id": userId};
  var update = { $addToSet: { following: userToFollow } };
  console.log("user logged in is: ", userId);
  console.log("user to follow is: ", userToFollow);

  User.findOneAndUpdate(query, update, function(err, user){
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      console.log([user.toEmber(userId)]);
      return res.status(200).send({user: [user.toEmber(userId)]});
      //res.status(500).send({message: 'something burning!'});
    }
  });
}  else if (operation === 'unfollow') {
  var userToUnfollow = req.body.user.meta.unfollowing
  var userId = req.params.userid;
  var query = {"id": userId};
  var update = {$pull: { following: userToUnfollow } };

  User.findOneAndUpdate(query, update, function(err, user){
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      console.log(user);
      return res.status(200).send({user: user.toEmber()});
    }
  });
 }
});

exports = module.exports = router;
