var express = require('express');
var db = require('../../db');
var User = db.model('User');
var router = express.Router();
var passport = require('../../middlewares/auth');
var bcrypt = require('bcrypt');
var generatePassword = require('password-generator');
var md5 = require('MD5'); //confirm this md5 and one in ember are the same;
var api_key = 'key-5d859d5065f347d54079bfd45effd0b0';
var domain = 'sandbox712cd50d71f84521ad15a187106d1f1d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

router.post('/', function (req, res) { //=> this translates to /api/users/
  //var operation = req.body.user.meta.operation;
  var email = req.body.user.email;
  //var password = req.body.user.meta.password

if (!req.body) return res.sendStatus(400);
  var newUser = req.body.user;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err) return console.error(err);
      var userToDb = new User({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: hash
      });
      userToDb.save(function(err, userToDb){
        if(err) return console.error(err);
        console.log("user info saved");
        console.dir(userToDb);
        req.login(userToDb, function(err) {
          if (err) {
            return res.sendStatus(500); }
            console.log("now returning user info after auth");
            return res.send({user: emberUser(userToDb)});
          });
        });
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
            console.log("now returning user info after auth");
            return res.send({users: [emberUser(user)]});
          });
        })(req, res, next);
      } else if (req.query.operation === 'isAuthenticated') {
        // This means that the client is asking the server if the user who made this request is authenticated or not.
        if (req.isAuthenticated()) {
          return res.send({users: [emberUser(req.user)]});
        } else {
          return res.send({users: []});
        }
      } else if (req.query.operation === 'getFollowers') {
        User.find({}, function (err, docs) {
          var emberUsersArray = docs.map(emberUser);
          return res.send({users: emberUsersArray});
        });
      } else if (req.query.operation === 'getFollowing') {
        User.find({}, function (err, docs) {
          var emberUsersArray = docs.map(emberUser);
          return res.send({users: emberUsersArray});
        });
      } else if (req.query.operation === 'passwordReset'){
        //super-nesting starts here
          var email = req.query.email;
          var newPassword = generateNewPassword();
          var md5Password = md5(newPassword);
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(md5Password, salt, function(err, hash){
              if(err) {console.log(err);}
              var query = {"email": email};
              var update = {password: hash};
              var options = {new: true};
              User.findOneAndUpdate(query, update, options, function(err, user){
                if(err) {
                  console.log(err);
                } else if (user===null) {
                  console.log("user NOT in system and email is", email);
                  res.status(404).send({message: "user not in system"});
                } else {
                  console.log("user in system and email is", email);

                  var data = {
                    from: 'Super Vik <vikram@freado.com>',
                    to: email,
                    subject: 'Password',
                    text: newPassword
                  };

                  mailgun.messages().send(data, function (error, body) {
                    console.log(body);
                  });
                  return res.sendStatus(200);

                }

              });
            });
          });

        //super-nesting ends here

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

    return res.send({user: emberUser(user)});

  });
});


function emberUser (user) {
  return {
    id: user.id,
    name: user.name
  }
}

function generateNewPassword(){
  var newPassword = generatePassword(12, false);
  return newPassword;
}

exports = module.exports = router;
