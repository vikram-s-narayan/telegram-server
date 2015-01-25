var express = require('express');
var logger = require('nlogger').logger(module);
var app = express();
var db = require('./db');

require('./middlewares')(app);

require('./router')(app);

db.once('open', function (callback) {
  console.log("db connected");
  var server = app.listen(3000, function() { //port number goes to nconf
  console.log('Listening on port %d', server.address().port);
 });
});

exports = module.exports = app;
