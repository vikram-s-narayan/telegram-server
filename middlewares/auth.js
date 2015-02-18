var passport = require('passport')//handles authentication and authorization
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db');
var User = db.model('User');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  {
    usernameField: 'user[id]'
    , passwordField: 'user[meta][password]'
  },
  function(username, password, done){
    User.findOne({'id': username}, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      } else {
        user.checkPassword(user, password, function(err, result){
          if (err) {
            console.log('error in checkPassword');
            return done(err);
          } else if (result) {
            console.log('Everything ok');
            return done(null, user, {message: 'Everything ok'});
          } else {
            console.log('incorrect password');
            return done(null, false, {message: 'Incorrect password'})
          }
          });
      }
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, user) {
    done(err, user);
  });
});


exports = module.exports = passport;
