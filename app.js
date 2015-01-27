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

/*testing mailgun
var api_key = 'key-5d859d5065f347d54079bfd45effd0b0';
var domain = 'sandbox712cd50d71f84521ad15a187106d1f1d.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
  //from: 'Excited User <me@samples.mailgun.org>',
  from: 'Super Vik <vikram@freado.com>',
  to: 'vikram@freado.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});

testing mailgun ends here
*/
exports = module.exports = app;
