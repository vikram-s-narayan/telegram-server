
function ensureAuthenticated(req, res, next) {
  console.log("middleware ensureAuthenticated called")
  if (req.isAuthenticated()) {
    console.log("user is allowed to do this action")
    return next();
  } else {
    console.log("forbidden action");
    //res.status(403).jsonp( {error: 'Forbidden action!'} );
    res.sendStatus(403);//<=this is a better way to do it ... unless you need customization;
  }
}

exports = module.exports = ensureAuthenticated;
