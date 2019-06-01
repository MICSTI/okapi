// use `dotenv` package to load app configuration to environment vars
require('dotenv').config();

const config = {
  app: {
    port: process.env.APP_PORT,
  },
};

module.exports = config;
