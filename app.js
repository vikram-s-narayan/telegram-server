var express = require('express');
var log = require('./log')
var app = express();
var db = require('./db');
var config = require('./config/config');

require('./middlewares')(app);

require('./router')(app);

db.once('open', function (callback) {
  var server = app.listen(config.get('serverPort'), function() {
  log.info('Listening on port %d', server.address().port);
  log.info('DB is', config.get('dbHost'));
 });
});

exports = module.exports = app;
