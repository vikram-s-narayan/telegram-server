var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '../templates/forgotpassword');
var Handlebars = require('handlebars');
var config = require('../config/config');
var api_key = config.get('mailgun:key');
var domain = config.get('mailgun:domain');
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var log = require('../log');

exports.sendPasswordResetEmail = function(user, plainTextPassword, done) {
  var email = user.email;
  log.info("user in system and email is", email);
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, fileData) {
    if (err) {
      log.info(err);
      throw err;
    } else {
      var template = Handlebars.compile(fileData);
      var data = { "password": plainTextPassword }
      var result = template(data);
      var emailData = {
        from: 'Telegram Admin <vikram@freado.com>',
        to: email,
        subject: 'Password',
        html: result
      };
      log.info('emailData is: ', emailData);
      mailgun.messages().send(emailData, function (error, body) {
        if (error) {
          log.info(err);
          return done(error);
        } else {
          return done('success');
        }
      });
    }
  });
}
