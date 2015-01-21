var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
  id: Number,
  postCreator: String,
  postContent: String,
  createdAt: Date
});

var exports = module.exports = postSchema;
