var fs    = require('fs');
var log = require('../log');
var nconf = require('nconf')
  , path = require('path');
nconf.env();
if(nconf.get('NODE_ENV')==='development'){
  nconf.file({ file: path.join(__dirname, 'config-dev.json') });
  log.info('using config-dev.json');
} else if(nconf.get('NODE_ENV')==='production'){
  nconf.file({ file: path.join(__dirname, 'config-prod.json') });
  log.info('using config-prod.json');
} else {
  logger.info('set NODE_ENV');
  process.exit(1);
}

exports = module.exports = nconf;
