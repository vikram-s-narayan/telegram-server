var fs    = require('fs');
var nconf = require('nconf')
  , path = require('path');
nconf.file({ file: path.join(__dirname, 'config-dev.json') });

exports = module.exports = nconf;
