var fs    = require('fs');
var logger = require('nlogger');
var nconf = require('nconf')
  , path = require('path');
nconf.env();//loads all variables from unix system and makes available;
if(nconf.get('NODE_ENV')==='development'){
  nconf.file({ file: path.join(__dirname, 'config-dev.json') });
} else if(nconf.get('NODE_ENV')==='production'){
  nconf.file({ file: path.join(__dirname, 'config-prod.json') });
} else {
  logger.error('set NODE_ENV');//need to fix this ...
  process.exit(1);//global object ... calls exit on process object;
}

exports = module.exports = nconf;
