var express = require('express');
var db = require('../../db');
var Post = db.model('Post');
var User = db.model('User');
var router = express.Router();
var ensureAuthenticated = require('../../middlewares/ensureAuthenticated');

router.get('/', ensureAuthenticated, function(req, res) {
  Post.find({}, function (err, docs) {
    var usersArray = [];
    var loggedInUser = req.user.id;
    console.log("This is loggedInUser: ", loggedInUser);

    docs.forEach(function(entry) {
      if(usersArray.indexOf(entry.postCreator)===-1){
        usersArray.push(entry.postCreator);
      }
    });
  User.findOne({'id': loggedInUser}, function(err, loggedInUserObject){
    if(err){console.log(err);}
    User.find({'id': { $in: usersArray }}, function(err, userObjects){
      var docs_users = userObjects.map(function(user){
            return user.toEmber(loggedInUserObject);
      });

      console.log("This is users",docs_users);
      return res.send({posts: docs,
                      users: docs_users
        });
      });
    });
  });
});

/*
router.get('/', function(req, res) {
  console.log('about to call .populate ...')
  Post.find().populate('postCreatorId').exec(function(err, posts) {
  // now for each post object the postCreator field will be the actual user not only an ID
  if (err){
    console.log('POST LISTING FAILED: ', err);
    res.sendStatus(500);
  } else {
    var users = posts.map(function(postCreatorId){
      console.log('POSTCREATORID: ', postCreatorId);
      console.log(postCreatorId.postCreatorId);
      if(postCreatorId.postCreatorId!==null){
        //console.log('**************', postCreatorId.postCreatorId.toEmber(postCreatorId.postCreatorId));
        return postCreatorId.postCreatorId.toEmber(postCreatorId.postCreatorId);
      } else {
        return 'poi poi';
      }
      });
    console.log('these are users ', users);
    res.send({posts: posts});
    }
  });
});
*/


router.delete('/:postid', function(req, res){
  console.log('delete request received for ...', req.params.postid);
  var query = { _id: req.params.postid}
  Post.findOneAndRemove(query, function(err, docs){
    if(err){
      console.log(err);
      return res.sendStatus(500);
    } else {
      console.log('about to send in docs ...')
      return res.send({ posts: docs })
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
