var userSchema = require('./schemas/user');
var postSchema = require('./schemas/post');
var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(config.get('dbHost'));
var db = mongoose.connection;
db.model('User', userSchema);
db.model('Post', postSchema);
db.on('error', console.error.bind(console, 'connection error:'));

exports = module.exports = db;
