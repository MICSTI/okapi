const express = require('express');
const bodyParser = require('body-parser');
const accessControl = require('./middlewares/accessControl');
const errorHandler = require('./controllers/errorHandler');

const initApp = (app) => {
  // set up body parser
  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // static routes
  app.use('/public', express.static('public'));

  // error handler
  app.use(errorHandler.handle);
};

module.exports.initApp = initApp;
