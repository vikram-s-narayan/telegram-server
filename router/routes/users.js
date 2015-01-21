var express = require('express');
var db = require('../../db');
var User = db.model('User');
var router = express.Router();

router.post('/', function (req, res) { //=> this translates to /api/users/
  if (!req.body) return res.sendStatus(400);
  var newUser = req.body.user;
  var userToDb = new User({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password
  });

  userToDb.save(function(err, userToDb){
    if(err) return console.error(err);
    console.dir(userToDb);

    req.login(userToDb, function(err) { //passport created req.login in the initialize middleware
      //req.login sets a cookie; uses the serializeUser function;
      if (err) {
        return res.sendStatus(500); }
        logger.info("now returning user info after auth");
        return res.send({user: emberUser(userToDb)});
      });

    });
  });





  router.get('/', function(req, res, next) {
    if (req.query.operation==="login") {
      passport.authenticate('local', function(err, user, info){ //err, user and info
        //are the arguments of the "done" function from local strategy;
        console.log("passport.authenticate called");
        if (err) { res.sendStatus(500); }
        //if (!user) { return res.sendStatus(404); }
        if (!user) { return res.status(403).send(info.message); } //If we don't have any user send the string message stored in the info variable.
          req.login(user, function(err) { //passport created req.login in the initialize middleware
            //req.login sets a cookie; uses the serializeUser function;
            if (err) {
              return res.sendStatus(500); }
              logger.info("now returning user info after auth");
              return res.send({users: [user]});
            });
          })(req, res, next);
        } else if (req.query.operation === 'isAuthenticated') {//why do we need an else if here since the next "if" is nested?
          // This means that the client is asking the server if the user who made this request is authenticated or not.
          if (req.isAuthenticated()) {
            return res.send({users: [req.user]});
          } else {
            return res.send({users: []});
          }
        } else if (req.query.operation === 'getFollowers') {
          //return res.send({users: users});
          User.find({}, function (err, docs) {
            var emberUsersArray = docs.map(emberUser); //automatically applies ember user function on each object of array and returns new values array
            return res.send({users: emberUsersArray});
          });
        } else if (req.query.operation === 'getFollowing') {
          //return res.send({users: users});
          User.find({}, function (err, docs) {
            return res.send({users: docs});
          });
        } else {
          console.log("now going to give status of 404")
          res.status(404);
          res.end();
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

      return res.send({user: user});

    });

  });


function emberUser (user) {
  return {
    id: user.id,
    name: user.name
  }
}

module.exports = router; //should we be saying exports = module.exports = router?
