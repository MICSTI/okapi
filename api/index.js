const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./controllers/errorHandler');
const authRoutes = require('./components/auth/routes');
const userRoutes = require('./components/users/routes');
const contentRoutes = require('./components/content/routes');

const initApp = (app) => {
  // set up body parser
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/content', contentRoutes);

  // static routes
  app.use('/public', express.static('public'));

  // error handler
  app.use(errorHandler.handle);
};

module.exports.initApp = initApp;
