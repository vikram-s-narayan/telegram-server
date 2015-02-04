//get express, router, passport etc.
var account = require('./account')
  , graph = require('./graph');

router.post('/', function (req, res, next) {
  var operation = req.body.user.meta.operation;

  switch (operation) {
    case 'login':
      return account.login(req, res);
    case 'signup':
      return account.signup(req, res);
    case 'resetPassword':
      return account.resetPassword(req, res);
    default:
      logger.error('unknown operation');
      return res.sendStatus(400); //bad request
  }
});

router.get('/', function(req, res, next) {
  var operation = req.query.operation;

 switch (operation) {
   case: 'ensureAuthenticated':
     return account.ensureAuthenticated(req, res);
   case: 'getFollowers':
     return graph.getFollowers(req, res);
 }
});


exports = module.exports = router;
