var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');//takes cookies and makes into json objects
//var passport = require('./middlewares/auth');
var session = require('express-session')
var MongoStore = require('connect-mongostore')(session);
var passport = require('./auth');

exports = module.exports = function (app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(session({ secret: 'apples and oranges',
                    resave: false,
                    saveUninitialized: true,
                    store: new MongoStore({'db': 'sessions'})
                    }));
  app.use(passport.initialize()); //this middleware (function with 3 arguments) ... and part of passport;
  app.use(passport.session());
}
