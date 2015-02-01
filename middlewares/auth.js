var passport = require('passport')//handles authentication and authorization
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db');
var User = db.model('User');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({'id': username}, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      } else {
        //user.checkPassword(password, function(err, result){ ...}); <=this is better because you want to do it on an existing user;
        //User.checkPassword(user, password, function(err, result){})
        validPassword(user, password, function(err, result) {
          if (err) { return done(err);
          } else if (result) {
            return done(null, user, {message: 'Everything ok'});
          } else {
            return done(null, false, {message: 'Incorrect password'})
          }
        });
      }
    });
  }
));


passport.serializeUser(function(user, done) { //passport calls this behind the scenes;
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, user) {
    done(err, user);//if no user exists, it will return null and null;
  });
});


function validPassword(user, password, done){
  bcrypt.compare(password, user.password, function(err, result){
    done(err, result);
  });
}

exports = module.exports = passport;
