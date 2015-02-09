var express = require('express');
var db = require('../../db');
var Post = db.model('Post');
var User = db.model('User');
var router = express.Router();
var ensureAuthenticated = require('../../middlewares/ensureAuthenticated');

router.get('/', function(req, res) {
  Post.find({}, function (err, docs) {
    var usersArray = [];

    docs.forEach(function(entry) {
      if(usersArray.indexOf(entry.postCreator)===-1){
        usersArray.push(entry.postCreator);
      }
    });

    User.find({'id': { $in: usersArray }}, function(err, docs_inside){
      var docs_users = docs_inside.map(function(user){
        return user.toEmber();
      });

      console.log("This is users",docs_users);
      return res.send({posts: docs,
                      users: docs_users
      });
    });
  });
});



router.delete('/:postid', function(req, res){
  console.log('delete request received for ...', req.params.postid);
  var query = { _id: req.params.postid}
  Post.findOneAndRemove(query, function(err, docs){
    if(err){
      console.log(err);
    } else {
      console.log('about to send in docs ...')
      res.send({ posts: docs })
    }
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
