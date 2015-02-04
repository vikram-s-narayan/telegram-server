var fs    = require('fs');
var nconf = require('nconf');
var config = nconf.file(
  { file: './home/ubuntu/telegram-server/config/config-dev.json' });
module.exports = config;
