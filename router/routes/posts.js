var express = require('express');
var db = require('../../db');
var Post = db.model('Post');
var router = express.Router();
var ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
//var ensureAuthenticated = middlewares.ensureAuthenticated;



router.get('/', function(req, res) {
  console.log('now trying to get all posts');
  Post.find({}, function (err, docs) {
    console.log("now in the call back of posts", docs);

    return res.send({posts: docs});
  });
});

router.post('/', ensureAuthenticated, function (req, res){
  var newPost = req.body.post;
  if (req.user.id===newPost.postCreator) {
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


exports = module.exports = router;
