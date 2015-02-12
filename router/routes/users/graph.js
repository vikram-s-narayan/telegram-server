var graph = exports;
var db = require('../../../db');
var User = db.model('User');


graph.getFollowers = function(req, res, currentUser) {
  console.log("this is currentUser in followers: ", currentUser);
  User.findOne({'id': currentUser}, function(err, userObject){
    if(err){console.log(err);}
    console.log('this is userObject from followers: ', userObject);
    User.find({}, function (err, docs) {
      var emberUsersArray = docs.map(function(user){
      if (req.isAuthenticated()) {
        return user.toEmber(req.user)
      } else {
        return user.toEmber();
        }
      });
      console.log('this is emberUsersArray from followers: ', emberUsersArray);
      return res.send({users: emberUsersArray});
    });
  });
}

graph.getFollowing = function(req, res, currentUser) {
  console.log("this is currentUser in following: ", currentUser);
  User.findOne({'id': currentUser}, function(err, userObject){
    if(err){console.log(err);}
    console.log('this is userObject from following: ', userObject);
    User.find({}, function (err, docs) {
      var emberUsersArray = docs.map(function(user){
        if (req.isAuthenticated()) {
          return user.toEmber(req.user)
        } else {
          return user.toEmber();
        }
      });
      console.log('this is emberUsersArray from following: ', emberUsersArray);
      return res.send({users: emberUsersArray});
    });
  });
}
