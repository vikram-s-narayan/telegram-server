var express = require('express');
var db = require('../../db');
var User = db.model('Post');
var router = express.Router();
var middlewares = require('../../middlewares');
var ensureAuthenticated = middlewares.ensureAuthenticated;
router.get('/', function(req, res) {
  Post.find({}, function (err, docs) {
    return res.send({posts: docs});
  });
});

router.post('/', ensureAuthenticated, function (req, res){
  var newPost = req.body.post;
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


module.exports = router;
