var account = exports;

//account.name is the same as exports.name ... we call it a reference

account.login = function (req, res) {
  //implement login function here;
  passport.authenticate('local', function(err, user, info){
    console.log("passport.authenticate called");
    if (err) { res.sendStatus(500); }
    if (!user) { return res.status(403).send(info.message); } //If we don't have any user send the string message stored in the info variable.
      req.login(user, function(err) { //passport created req.login in the initialize middleware
        //req.login sets a cookie; uses the serializeUser function;
        if (err) {
          return res.sendStatus(500); }
          console.log("now returning user info after auth");
          console.log("now returning user.toEmber ...", user.toEmber());
          return res.send({users: [user.toEmber()]})
        });
      })(req, res); // deleted next;
}
