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
var emails = require('../../emails');
var log = require('../../../log');

account.login = function (req, res) {
  passport.authenticate('local', function(error, user, info){
    log.info("passport.authenticate called for: ", user);
    if (error) {
      log.info(err);
      return res.sendStatus(500); }
    if (!user) {
      log.info('no user');
      return res.status(403).send(info.message); } //If we don't have any user send the string message stored in the info variable.

    req.login(user, function(error) {
      if (error) {
        log.info(err);
        return res.sendStatus(500); }
        log.info("user.toEmber ...", user.toEmber());
        return res.send({users: [user.toEmber()]});
        });
      })(req, res);
    }

account.signup = function(req, res) {
  if (!req.body) {
    log.info('someone tried to submit empty form');
    return res.sendStatus(400); }
  var newUser = req.body.user;
  log.info(newUser);
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
    userToDb.save(function(error, userToDb) {
      if(error) {
        log.info(err);
        return res.sendStatus(500);
      }
      log.info('user info saved for: ', newUser.id);
      req.login(userToDb, function(error) {
        if (error) {
          log.info(err);
          return res.sendStatus(500);
        } else {
          var toEmberUser = userToDb.toEmber()
          log.info('logging in after signup of user: ', toEmberUser);
          return res.send({ user: toEmberUser });
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

  User.encryptPassword(md5Password, function(error, hash) {
    if(error) { log.info(err); }
    var query = { "email": email };
    var update = { password: hash };
    var options = { new: true };
    User.findOneAndUpdate(query, update, options, function(error, user){
      if(error) {
        log.info(err);
        return res.sendStatus(500);
      } else if (user===null) {
        log.info("user NOT in system for email: ", email);
        res.status(404).send({ message: "user not in system" });
      } else {
        emails.sendPasswordResetEmail(user, newPassword, function(msg){
          if (msg === null) {
            return res.send({users: []});
          } else {
            log.info(msg);
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
    log.info("returning authenticated user: ", req.user.toEmber());
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
