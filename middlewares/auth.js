var passport = require('passport')//handles authentication and authorization
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db');
var User = db.model('User');
var bcrypt = require('bcrypt');
var log = require('../log');

passport.use(new LocalStrategy(
  {
    usernameField: 'user[id]'
    , passwordField: 'user[meta][password]'
  },
  function(username, password, done){
    User.findOne({'id': username}, function(error, user) {
      if (error) {
        log.info(err);
        return done(error);
      } else if (!user) {
        log.info('no user');
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        user.checkPassword(user, password, function(error, result){
          if (error) {
            log.info(err);
            return done(err);
          } else if (result) {
            log.info('Everything ok for: ', user.id);
            return done(null, user, { message: 'Everything ok' });
          } else {
            log.info('incorrect password');
            return done(null, false, { message: 'Incorrect password' });
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
