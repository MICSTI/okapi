const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./controllers/errorHandler');
const userRoutes = require('./components/users/routes');
const updateRoutes = require('./components/update/routes');

const initApp = (app) => {
  // set up body parser
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/update', updateRoutes);

  // static routes
  app.use('/public', express.static('public'));

  // error handler
  app.use(errorHandler.handle);
};

module.exports.initApp = initApp;
