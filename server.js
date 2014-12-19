var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/api/users/:userid', function(req, res) {
  var id = req.params.userid;
  for (i=0; i<users.length; i++) {
    if (users[i].id===id) {
      return res.send({user: users[i]}) //default set to 200 status
    }
  }
  res.status(404);
  res.end();
});


app.get('/api/posts', function(req, res) {
  res.send({posts: posts}) //key can either be with or without quotes
})

app.get('/api/users', function(req, res) {
  if (req.query.operation==="login") {
    for (var i=0; i<users.length; i++) {
      if ((users[i].id===req.query.username) && (users[i].password===req.query.password)) {
        console.log("printing users object");
        console.log([users[i]]);
        return res.send({users: [users[i]]});
      }
    }
    return res.send({users: []});
  } else {
    return res.send({users: users});
  }
  res.status(404);
  res.end();
});

app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
    // create user in req.body
    //var id = req.body.id;
    //var name = req.body.username;
    //var password = req.body.password;
    var newUser = {
      id: req.body.id,
      name: req.body.name,
      email: null, //because currently not handled in the ember signup route
      password: req.body.password,
      posts: []
    };
    users.push(newUser);
    console.log(newUser);
    return res.send({users: [newUser]});
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
  //res.send({users: users});//this worked;
  //res.status(200).end();
  //if req.query.operation==='login' then find the user whose id matches
  //request.query.username
  //then check if password matches
  //then send back the user object to the client
  //ember is expecting an array so
  //should take form {users: [this_user]}
  //else send all the users to the client
  //required by followers and following in users

  // Route implementation
  //go to http://192.168.56.10:3000/hello.txt to see this
  /*app.get('/hello.txt', function(req, res) {
  res.send('Hello World');
});*/
