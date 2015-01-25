var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  id: {type: String, unique: true},
  name: String,
  email: String,
  password: String,
  posts: [{id: Number}]
});

exports = module.exports = userSchema;
