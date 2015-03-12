var graph = exports;
var db = require('../../../db');
var User = db.model('User');
var log = require('../../../log');


graph.getFollowers = function(req, res, profileUserId) {
  console.log("this is profileUserId in followers: ", profileUserId);
  User.findOne({id: profileUserId}, function(err, userObject){
    if(err){
      log.info(err);
      return res.sendStatus(500);
      }
    User.find({following: profileUserId}, function (error, docs) {
      if (error) {
        log.info(err);
        return res.sendStatus(500)}
      var emberUsersArray = docs.map(function(user){
        log.info('returning followers');
        return user.toEmber(req.user);
      });
      return res.send({users: emberUsersArray});
    });
  });
}

graph.getFollowing = function(req, res, profileUserId) {
  log.info("this is profileUserId in following: ", profileUserId);
  User.findOne({id: profileUserId}, function(error, userObject){
    if(error){
      log.info(err);
      return res.sendStatus(500);
      }
    log.info('profileUserId from following: ', userObject);
    var followingArray = userObject.following;
    User.find({'id': { $in: followingArray }}, function (err, docs) {
      var emberUsersArray = docs.map(function(user){
          log.info('returning users being followed by this user');
          return user.toEmber(req.user)
      });
      return res.send({users: emberUsersArray});
    });
  });
}
