var log = require('../log');

function ensureAuthenticated(req, res, next) {
  log.info("middleware ensureAuthenticated called")
  if (req.isAuthenticated()) {
    console.log("user is allowed to do this action")
    return next();
  } else {
    log.info("forbidden action tried");
    res.sendStatus(403);
  }
}

exports = module.exports = ensureAuthenticated;
