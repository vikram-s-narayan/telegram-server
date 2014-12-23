var express = require('express');
var bodyParser = require('body-parser');
var logger = require('nlogger').logger(module); //module here is an object that contains info about this server.js file
var cookieParser = require('cookie-parser');

var session = require('express-session')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("local strategy called");
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

//do I need to create a findOne function like so?
function findOne(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}



var app = express();

app.use(cookieParser());//installed separately as it's been removed from Express
app.use(bodyParser.json());
app.use(session({ secret: 'apples and oranges', resave: false,saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

app.get('/api/users/:userid', function(req, res) {
  var id = req.params.userid;
  for (i=0; i<users.length; i++) {
    if (users[i].id===id) {
      logger.info("user sent");

      return res.send({user: users[i]}) //default set to 200 status
    }
  }
  logger.error("user does not exist");
  res.status(404);
  res.end();
});

app.get('/api/posts', function(req, res) {
  res.send({posts: posts}) //key can either be with or without quotes
})

app.get('/api/users', function(req, res, next) {
  if (req.query.operation==="login") {
    passport.authenticate('local', function(err, user, info){
      console.log("passport.authenticate called");
      if (err) { res.sendStatus(500); }
      if (!user) { return res.sendStatus(404); }
      req.login(user, function(err) {
        if (err) { return res.sendStatus(500); }
        logger.info("now returning user info after auth");
        return res.send({users: [user]});
      });
    })(req, res, next);

  } else {
    return res.send({users: users});
  }
  res.status(404);
  res.end();
});

app.post('/api/users', function (req, res) {
  if (!req.body) return res.sendStatus(400)
    newUser = req.body.user;
    users.push(newUser);
    console.log(newUser);
    return res.send({user: newUser});
  });

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var users = [
  {
    id: "j",
    name: "John Donnahue Smith",
    email: "johns@gmail.com",
    password: "j",
    //photoURL: "/images/john.jpg",
    posts: [1,2],
    //followers: ["mary"],
    //following: ["mary"]
  },
  {
    id: "sarah",
    name: "Sarah Englewood",
    email: "sarah@gmail.com",
    password: "sarah",
    //photoURL: "/images/sarah.jpg",
    posts: [3,4],
    //followers: ["mary"],
    //following: ["mary","david"]
  },
  {
    id: "mary",
    name: "Mary Jane",
    email: "mary@gmail.com",
    password: "mary",
    //photoURL: "/images/mary.jpg",
    posts: [5,6],
    //followers: ["john", "sarah"],
    //following: ["john", "sarah"]
  }
  ];

var posts = [
  {
    id: 1,
    postCreator: "j",
    postContent: "Round the rugged rock ...",
    createdAt: new Date("October 13, 2014 11:13:00")
  },
  {
    id: 2,
    postCreator: "j",
    postContent: "Ran the ragged rascal!",
    createdAt: new Date("October 14, 2014 12:30:00")
  },
  {
    id: 3,
    postCreator: "sarah",
    postContent: "Beautiful bright day today!",
    createdAt: new Date("October 14, 2014 12:40:00")
  },
  {
    id: 4,
    postCreator: "sarah",
    postContent: "The sun shines bright here in Oz",
    createdAt: new Date("October 12, 2014 12:30:00")
  },
  {
    id: 5,
    postCreator: "mary",
    postContent: "We're having a snow storm here",
    createdAt: new Date("October 14, 2014 2:30:00")
  },
  {
    id: 6,
    postCreator: "mary",
    postContent: "The lake opposite is frozen!",
    createdAt: new Date("October 15, 2014 12:30:00")
  }
  ];
  // Route implementation
  //go to http://192.168.56.10:3000/hello.txt to see this
  /*app.get('/hello.txt', function(req, res) {
  res.send('Hello World');
});*/
