exports = module.exports = function (app) {
  //the signup route from signup.js
  //"router.post('/api/users')" will have the URL "/signup/api/users"
  //It concatenates what you have in index.js and what you have in the route definition
  //app.use('/signup', require('./routes/signup'));
  //so use the following ...
  app.use('/api/users', require('./routes/users'));//this is a 'mini-router'
//And now when we concatenate the urls /api/users + / we get /api/users/ - exactly what we want for POST /api/users.
  app.use('/api/posts', require('./routes/posts')); //single . means start from the current folder;
  app.use('/api/logout', require('./routes/logout'));
};
