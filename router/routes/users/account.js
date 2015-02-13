var account = exports;
//account.name is the same as exports.name ... we call it a reference
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

account.login = function (req, res) {
  //implement login function here;
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
      })(req, res); // deleted next;
}

account.signup = function(req, res) {
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
      password: hash,
      imgUrl: generateImgUrl()
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
}

account.passwordReset = function(req, res) {
  //super-nesting starts here
  var email = req.body.user.email;
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
            console.log('emailData is: ', emailData);
            mailgun.messages().send(emailData, function (error, body) {
              if (error) {
                console.log(error);
              } else {
                console.log('api key is: ', api_key);
                console.log('domain is: ', domain);
                console.log('and now the body ...');
                console.log(body);
                return res.send({users: []});
              }
            });
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
  var randomInt = getRandomInt(1,5);
  switch (randomInt) {
  case 1:
  return "/images/avatar-blue.png";
  case 2:
  return "/images/avatar-orange.png";
  case 3:
  return "/images/avatar-red.png"
  default:
  return "/images/avatar-green.png"
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
