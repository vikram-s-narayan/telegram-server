var express = require('express');
var db = require('../../db');
var Post = db.model('Post');
var router = express.Router();
var ensureAuthenticated = require('../../middlewares/ensureAuthenticated');

router.get('/', function(req, res) {
  Post.find({}, function (err, docs) {
    return res.send({posts: docs});
  });
});

//Post.find({ id:333 }).remove().exec();

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
