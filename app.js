var express = require('express');
var logger = require('nlogger').logger(module);
var app = express();
var db = require('./db');
var fs    = require('fs');
var nconf = require('nconf');
var config = require('./config/config');



require('./middlewares')(app);

require('./router')(app);

config.file(
{ file: './home/ubuntu/telegram-server/config/config-dev.json' });
console.log(config.get('serverPort'));
console.log(config.get('mailgunKey'));

db.once('open', function (callback) {
  console.log("db connected");

  var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
 });
});

exports = module.exports = app;

// config js file; has a variable that does a nconf require;
// keep config.js and config-dev.json file in the config folder;
//nconf.file({ file: 'path/to/config-dev.json' => use absolute path not relative path });
//export the nconf variables
//in app, when you need one parameter, import config (var config = require('config'))
//then config.get(name of parameter you want);
