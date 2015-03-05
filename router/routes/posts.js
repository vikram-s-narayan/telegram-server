var express = require('express');
var db = require('../../db');
var Post = db.model('Post');
var User = db.model('User');
var router = express.Router();
var ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
var log = require('../../log');

router.get('/', function(req, res) {
  log.info('entering mystream route');
  Post.find({}).populate('postCreatorId').exec(function(err, posts) {
    if (err){
      log.info(err)
      return res.sendStatus(500);
    }

    log.info("POSTS: ", posts);

    var users = posts.map(function(post) {
      return post.postCreatorId.toEmber(req.user);
      // post.postCreatorId is now user object so you must call toEmber() on it.
    })

    log.info("USERS: ", users);
    return res.send({posts: posts, users: users})
    // sending the users as well - sideloading
  });
});


router.delete('/:postid', function(req, res){
  log.info('delete request received for ...', req.params.postid);
  var query = { _id: req.params.postid}
  Post.findOneAndRemove(query, function(error, docs){
    if(error){
      log.info(err);
      return res.sendStatus(500);
    } else {
      log.info('about to send in docs ...')
      return res.send({ posts: docs })
    }
  });
});


router.post('/', ensureAuthenticated, function (req, res){
  var newPost = req.body.post;
  if (req.user.id===newPost.postCreator) {
    var postToDb = new Post({
      postCreatorId: req.user._id,//need to check this
      postCreator: newPost.postCreator,
      postContent: newPost.postContent,
      createdAt: new Date()
    });

    postToDb.save(function(error, postToDb){
      if(error) {
        log.info(err);
        return res.sendStatus(500);
      } else {
        log.info('new post created: ', postToDb.postContent);
        return res.send({post: postToDb});
      }
    });

  } else {
    log.info("cannot make this post");
    return res.status(403);
    res.end();
  }
});


exports = module.exports = router;
