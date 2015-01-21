var express = require('express'); //framework for node
 //takes content of new posts and new users created (form input) and makes into json objects
var logger = require('nlogger').logger(module); //module here is an object that contains info about this server.js file


 //type of authentication where we authenticate off local store
//temporary experiment
var yay = require('./yay.js');
yay.name();
//temporary experiment ends here


//userSchema is a description of data; connection is the pipe through which raw data flows;


var postSchema = new Schema({
  id: Number,
  postCreator: String,
  postContent: String,
  createdAt: Date
});


//model consists of two parts - one is the connection the other is the description of data;
//mongoose.model can be mongoose.connection.model
var Post = mongoose.model('Post', postSchema);

/*
var userToDb = new User({
  id: "obelix",
  name: "Obelix the Gaul",
  email: "obelix@gaul.com",
  password: "gaul",
});

userToDb.save(function(err, userToDb) {
  if (err) return console.error(err);
  console.dir(userToDb);
});

User.findOne({ 'id': 'obelix' }, 'name email', function (err, user) {
  if (err) return handleError(err);
  console.log('%s has email: %s.', user.name, user.email);
  });
*/

/*
User.find({},function(err, docs) {
    if (!err){
      console.log(docs);
      process.exit();
    }
    else { throw err;}
    });

*/
//function findOne(username, fn) { //fn argument refers to the callback of the function;
  //Once username found, you call fn; this is an async function;
  //take username and send me the results via the fn function
  //var userReturned = {};
  //User.findOne({'id': username},function (err, user) {
      /*
      if (err) return handleError(err);
        userReturned.id = user.id;
        userReturned.name = user.name;
        userReturned.email = user.email;
        userReturned.password = user.password;
        userReturned.posts = user.posts;
        return fn(null, userReturned);
        return fn(null, null); // if user not found in system;
        */
    //});
//}
function findOne (username, fn) {
    User.findOne( { 'id': username }, fn);
  }




function validPassword(user, password){
  if (user.password === password) {
    return true;
  } else {
    return false;
  }
}


var app = express();

require('./middlewares')(app);

require('./router')(app);



app.get('/api/posts', function(req, res) {
  Post.find({}, function (err, docs) {
    return res.send({posts: docs});
  });
  //res.send({posts: posts}) //key can either be with or without quotes
});


app.post('/api/posts', ensureAuthenticated, function (req, res){
  var newPost = req.body.post;
  //console.log("isAuthenticated via ensureAuthenticated: " + req.isAuthenticated());
  if (req.user.id===newPost.postCreator) {
    /*var postId = posts.length+1;
    newPost.id = postId;
    posts.push(newPost);*/
    var postToDb = new Post({
      postCreator: newPost.postCreator,
      postContent: newPost.postContent,
      createdAt: new Date()
    });

    postToDb.save(function(err, postToDb){
      if(err) return console.error(err);
      console.dir(postToDb);
      return res.send({post: postToDb});
    });


  } else {
      console.log("cannot make this post");
      return res.status(403);
      res.end();
    }
});

app.post('/api/logout', function(req, res) {
  req.logOut();
  res.sendStatus(200);//where is this success message being used? You can test with 403;
});
db.once('open', function (callback) { //event fires when connection is established
  console.log("db connected");
  var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });

});

/**
* Router
*/
var router = require('./router')(app); //<= what happens here?

// Error Handling
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;

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
