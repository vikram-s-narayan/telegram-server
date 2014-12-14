var express = require('express');
var app = express();
// Route implementation
app.get('/hello.txt', function(req, res) {
  res.send('Hello Awesome World');
});
app.get('api/',function(req,res){
  res.send({signup: signup});
})
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var users = [
  {
    id: "j",
    name: "John Donnahue",
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
