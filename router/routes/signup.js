var express = require('express');
var router = express.Router();

router.post('/', function (req, res) { //=> this translates to /api/users/
  if (!req.body) return res.sendStatus(400);
  var newUser = req.body.user;
  var userToDb = new User({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    password: newUser.password
  });

  userToDb.save(function(err, userToDb){
    if(err) return console.error(err);
    console.dir(userToDb);

    req.login(userToDb, function(err) { //passport created req.login in the initialize middleware
      //req.login sets a cookie; uses the serializeUser function;
      if (err) {
        return res.sendStatus(500); }
        logger.info("now returning user info after auth");
        return res.send({user: emberUser1(userToDb)});
      });

    });
  });

  function emberUser1 (user) {
    return {
      id: user.id,
      name: user.name
    }
  }


module.exports = router; //should we be saying exports = module.exports = router?
