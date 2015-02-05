var graph = exports;

var db = require('../../../db');
var User = db.model('User');

graph.getFollowers = function(req, res) {
  User.find({}, function (err, docs) {
    console.log('returning followers via graph.js');
    var emberUsersArray = docs.map(function(user){
      return user.toEmber();
    });
    return res.send({users: emberUsersArray});
  });
}

graph.getFollowing = function(req, res) {
  User.find({}, function (err, docs) {
    console.log('returning following via graph.js');
    var emberUsersArray = docs.map(function(user){
      return user.toEmber();
    });
    return res.send({users: emberUsersArray});
  });
}
