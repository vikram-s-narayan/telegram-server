
function ensureAuthenticated(req, res, next) {
  console.log("middleware ensureAuthenticated called")
  if (req.isAuthenticated()) {
    console.log("user is allowed to do this action")
    return next();
  } else {
    console.log("forbidden action");
    res.sendStatus(403);
  }
}

exports = module.exports = ensureAuthenticated;
