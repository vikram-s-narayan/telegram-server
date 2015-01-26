var passport = require('passport')//handles authentication and authorization
var LocalStrategy = require('passport-local').Strategy;
//need to import User
var db = require('../db');
var User = db.model('User');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy( //instantiating a class of local strategy / object;
  function(username, password, done) { //done is a callback function
    console.log("local strategy called");
    User.findOne({'id': username}, function(err, user) { //matches "fn" in the function findOne
    if (err) { return done(err); } //done function refers to the second argument
      //of password.authenticate => function(err, user, info)
      if (!user) {
        console.log("incorrect username " + username);
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!validPassword(user, password)) {
        console.log("incorrect password " + password);
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('everything okay with ' + user.id);
      return done(null, user); // if everything goes okay ... username and password ok;
    });
  }
));


passport.serializeUser(function(user, done) { //passport calls this behind the scenes;
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, user) {
    console.log('Now about to call on "done" callback in deserialize function');
    done(err, user);//if no user exists, it will return null and null;
  });
});

function validPassword(user, password){
  //var passwordIsValid = (user.password === password);
  console.log("entered by user ",password);
  console.log("from DB ",user.password);
  var passwordIsValid = bcrypt.compareSync(password, user.password);
  return passwordIsValid;
}

exports = module.exports = passport;
