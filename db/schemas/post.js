var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
  id: Number,
  /*postCreatorId: {
    type: Schema.ObjectId,
    ref: 'User'},*/
  postCreator: String,
  postContent: String,
  createdAt: Date
});

exports = module.exports = postSchema;
