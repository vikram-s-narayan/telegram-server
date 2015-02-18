var express = require('express');
var logger = require('nlogger').logger(module);
var app = express();
var db = require('./db');
var config = require('./config/config');



require('./middlewares')(app);

require('./router')(app);


console.log(config.get('mailgun:key'));

console.log(config.get('dbHost'));



db.once('open', function (callback) {
  console.log("db connected");

  var server = app.listen(config.get('serverPort'), function() {
  console.log('Listening on port %d', server.address().port);
 });
});

exports = module.exports = app;
