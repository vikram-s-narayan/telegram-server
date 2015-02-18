exports = module.exports = function (app) {

  app.use('/api/users', require('./routes/users'));
  app.use('/api/posts', require('./routes/posts')); 
  app.use('/api/logout', require('./routes/logout'));
}
