var express = require('express'); //framework for node
var bodyParser = require('body-parser'); //takes content of new posts and new users created (form input) and makes into json objects
var logger = require('nlogger').logger(module); //module here is an object that contains info about this server.js file
var cookieParser = require('cookie-parser');//takes cookies and makes into json objects

var session = require('express-session') //creates and reads cookies to maintain sessions

var passport = require('passport')//handles authentication and authorization
var LocalStrategy = require('passport-local').Strategy; //type of authentication where we authenticate off local store

passport.use(new LocalStrategy( //instantiating a class of local strategy / object;
  function(username, password, done) { //done is a callback function
    console.log("local strategy called");
    findOne(username, function(err, user) { //matches "fn" in the function findOne
      if (err) { return done(err); } //done function refers to the second argument
        //of password.authenticate => function(err, user, info)
        if (!user) {
          console.log("incorrect username " + username);
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!validPassword(user, password)) {
          console.log("incorrect password " + password);
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user); // if everything goes okay ... username and password ok;
      });
    }
  ));


function findOne(username, fn) { //fn argument refers to the callback of the function;
  //Once username found, you call fn; this is an async function;
  //take username and send me the results via the fn function
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (username === user.id) {
      return fn(null, user);
    }
  }
  return fn(null, null); // if user not found in system;
}

function validPassword(user, password){
  if (user.password === password) {
    return true;
  } else {
    return false;
  }
}


var app = express();

app.use(cookieParser());//installed separately as it's been removed from Express
app.use(bodyParser.json());
app.use(session({ secret: 'apples and oranges', resave: false,saveUninitialized: true }));
app.use(passport.initialize()); //this middleware (function with 3 arguments) ... and part of passport;
app.use(passport.session());


  passport.serializeUser(function(user, done) { //passport calls this behind the scenes;
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    findOne(id, function(err, user) {
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
    passport.authenticate('local', function(err, user, info){ //err, user and info
      //are the arguments of the "done" function from local strategy;
      console.log("passport.authenticate called");
      if (err) { res.sendStatus(500); }
      //if (!user) { return res.sendStatus(404); }
      if (!user) { return res.status(403).send(info.message); } //If we don't have any user we're sending the string message stored in the info variable.
      req.login(user, function(err) { //passport created req.login in the initialize middleware
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

app.post('/api/posts', function (req, res){
  var newPost = req.body.post;
  console.log("This is req.isAuthenticated: " + req.isAuthenticated());
  if (req.isAuthenticated() && req.user.id===newPost.postCreator) {
    var postId = posts.length+1;
    newPost.id = postId;
    posts.push(newPost);
    return res.send({post: newPost});
  } else {
      console.log("cannot make this post");
      return res.status(403);
      res.end();
    }
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
