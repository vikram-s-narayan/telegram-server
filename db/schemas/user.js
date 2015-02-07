var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: {type: String, unique: true},
  name: String,
  email: String,
  password: String,
  posts: [{id: Number}],
  following: [] // contains ids of users that instance user is following;
  //we'll be using $addToSet, $pull in MongoDB;
  //when we do the updates
});

userSchema.methods.toEmber = function(loggedInUser) {
  var emberUser =  {
  id: this.id,
  name: this.name,
  isFollowing: false
  }
if (loggedInUser) {
  emberUser.isFollowing = (loggedInUser.following||[]).indexOf(this.id)!==-1
}
  return emberUser;
}

userSchema.methods.checkPassword = function(user, password, done){
  bcrypt.compare(password, user.password, function(err, result){
    done(err, result);
  });
}

userSchema.statics.encryptPassword = function (password, cb) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if(err) {
        return console.error(err);
      } else {
        console.log("returning hash");
        cb(err, hash);
      }
    });
  });
}

var User = mongoose.model('User', userSchema);


exports = module.exports = userSchema;
