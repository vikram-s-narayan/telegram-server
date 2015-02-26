var bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'telegram',
  src: true
});
