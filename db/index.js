var userSchema = require('./schemas/user')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/telegram');
var db = mongoose.connection; //creates a default connection and stores it in mongoose.connection
db.model('User', userSchema);
db.on('error', console.error.bind(console, 'connection error:'));

exports = module.exports = db;
