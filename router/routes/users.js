var express = require('express');
var db = require('../../db');
var User = db.model('User');
var router = express.Router();
var passport = require('../../middlewares/auth');
var bcrypt = require('bcrypt');
var generatePassword = require('password-generator');
var md5 = require('MD5');
var api_key = 'key-ca9dc9487107edeba3fbb0333f75782f'//'key-66a7f0cf094c6ae8f1a827df5795b852';
var domain = 'sandbox712cd50d71f84521ad15a187106d1f1d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var fs = require('fs');
var path = require('path');//helps concatenate two paths
var filePath = path.join(__dirname, '../../templates/forgotpassword'); //dirname - path to the local directory in node where the source file is;
var Handlebars = require('handlebars');

router.post('/', function (req, res, next) { //=> this translates to /api/users/
  var operation = req.body.user.meta.operation;
  var email = req.body.user.email;
  var password = req.body.user.meta.password

  if(operation === 'login'){
    passport.authenticate('local', function(err, user, info){
      console.log("passport.authenticate called");
      if (err) { res.sendStatus(500); }
      if (!user) { return res.status(403).send(info.message); } //If we don't have any user send the string message stored in the info variable.
        req.login(user, function(err) { //passport created req.login in the initialize middleware
          //req.login sets a cookie; uses the serializeUser function;
          if (err) {
            return res.sendStatus(500); }
            console.log("now returning user info after auth");
            console.log("now returning user.toEmber ...", user.toEmber());
            return res.send({users: [user.toEmber()]})
          });
        })(req, res, next);
  } else if (operation === 'signup') {
    if (!req.body) return res.sendStatus(400);
    var newUser = req.body.user;
    console.log(newUser);
    console.log(newUser.meta.password);
    User.encryptPassword(newUser.meta.password, function(err, hash) {
      console.log("got the hash. now creating userToDb");
      var userToDb = new User({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: hash
    });
    userToDb.save(function(err, userToDb) {
      if(err) return console.error(err);
      console.log('user info saved');
      console.dir(userToDb);
      req.login(userToDb, function(err) {
        if (err) {
          return res.sendStatus(500);
          } else {
          console.log("now returning user info after auth");
          console.log("userToDb.toEmber is ...", userToDb.toEmber());
          return res.send({user: userToDb.toEmber()});
        }
      });
    });
  });
  } else if (operation === 'passwordReset') {
    //super-nesting starts here
    var email = req.body.user.email;
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
            fs.readFile(filePath, {encoding: 'utf-8'}, function (err, fileData) {
              if (err) {
                throw err;
              } else {
                var template = Handlebars.compile(fileData);
                var data = { "password": newPassword }
                var result = template(data);
                var emailData = {
                  from: 'Super Vik <vikram@freado.com>',
                  to: email,
                  subject: 'Password',
                  html: result
                };
                mailgun.messages().send(emailData, function (error, body) {
                  console.log(body);
                  return res.send({users: []});
                });
              }
            });
          }
        });
      });
    });
    //super-nesting ends here
  }
});

router.get('/', function(req, res, next) {

  if (req.query.operation === 'isAuthenticated') {
        if (req.isAuthenticated()) {
          console.log("now returning authenticated user ...", req.user.toEmber())
          return res.send({users: [req.user.toEmber()]});
        } else {
          return res.send({users: []});
        }
      } else if (req.query.operation === 'getFollowers') {
        User.find({}, function (err, docs) {
          console.log('returning followers');
          var emberUsersArray = docs.map(function(user){
            return user.toEmber();
          });
          return res.send({users: emberUsersArray});
        });
      } else if (req.query.operation === 'getFollowing') {
        User.find({}, function (err, docs) {
          console.log('returning following');
          var emberUsersArray = docs.map(function(user){
            return user.toEmber();
          });
          return res.send({users: emberUsersArray});
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

    console.log("returning in :userid ...", user.toEmber());
    return res.send({user: user.toEmber()});//8
  });
});


function generateNewPassword(){
  var newPassword = generatePassword(12, false);
  return newPassword;
}

exports = module.exports = router;
