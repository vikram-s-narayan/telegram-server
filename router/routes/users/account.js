var account = exports;
var db = require('../../../db');
var User = db.model('User');
var passport = require('../../../middlewares/auth');
var generatePassword = require('password-generator');
var md5 = require('MD5');
var fs = require('fs');
var path = require('path');//helps concatenate two paths
var filePath = path.join(__dirname, '../../../templates/forgotpassword');
var Handlebars = require('handlebars');
var config = require('../../../config/config');
var api_key = config.get('mailgun:key');//no space between mailgun and key
var domain = config.get('mailgun:domain');
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var emails = require('../../emails');

account.login = function (req, res) {
  passport.authenticate('local', function(err, user, info){
    console.log("passport.authenticate called");
    if (err) { return res.sendStatus(500); }
    if (!user) { return res.status(403).send(info.message); } //If we don't have any user send the string message stored in the info variable.
      req.login(user, function(err) {
        if (err) {
          return res.sendStatus(500); }
          console.log("now returning user info after auth");
          console.log("now returning user.toEmber ...", user.toEmber());
          return res.send({users: [user.toEmber()]});
        });
      })(req, res);
}

account.signup = function(req, res) {
  if (!req.body) return res.sendStatus(400);
  var newUser = req.body.user;
  console.log(newUser);
  console.log(newUser.meta.password);
  User.encryptPassword(newUser.meta.password, function(err, hash) {
    if (err) { return res.sendStatus(500); }
    console.log("got the hash. now creating userToDb");
    var userToDb = new User({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: hash,
      imgUrl: generateImgUrl()
    });
    userToDb.save(function(err, userToDb) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
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
}

account.passwordReset = function(req, res) {
  var email = req.body.user.email;
  var user = req.body.user;
  var newPassword = generateNewPassword();
  var md5Password = md5(newPassword);

  User.encryptPassword(md5Password, function(err, hash) {
    if(err) {console.log(err);}
    var query = {"email": email};
    var update = {password: hash};
    var options = {new: true};
    User.findOneAndUpdate(query, update, options, function(err, user){
      if(err) {
        console.log(err);
        return res.sendStatus(500);
      } else if (user===null) {
        console.log("user NOT in system and email is", email);
        res.status(404).send({message: "user not in system"});
      } else {
        emails.sendPasswordResetEmail(user, newPassword, function(msg){
          if (msg === 'success') {
            return res.send({users: []});
          } else {
            console.log(msg);
            return res.sendStatus(500);
          }
        });

      }
    });
  });
}

account.isAuthenticated = function(req, res) {
{
  if (req.isAuthenticated()) {
    console.log("now returning authenticated user ...", req.user.toEmber());
    return res.send({users: [req.user.toEmber()]});
  } else {
    return res.send({users: []});
    }
  }
}

function generateNewPassword(){
  var newPassword = generatePassword(12, false);
  return newPassword;
}

function generateImgUrl(){

  var pictures = ["/images/avatar-blue.png",
                  "/images/avatar-orange.png",
                  "/images/avatar-red.png",
                  "/images/avatar-green.png"];

  return pictures[getRandomInt(0, pictures.length)]
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
