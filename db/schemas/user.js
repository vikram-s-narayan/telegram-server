var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  id: {type: String, unique: true},
  name: String,
  email: String,
  password: String,
  posts: [{id: Number}]
});

userSchema.methods.toEmber = function(cb) {
  return {
    id: this.id,
    name: this.name
  }
}

exports = module.exports = userSchema;
