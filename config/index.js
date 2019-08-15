// use `dotenv` package to load app configuration to environment vars
require('dotenv').config();

const config = {
  app: {
    id: process.env.APP_ID,
    port: process.env.APP_PORT,
  },
  db: {
    devKeyvalStore: process.env.DEV_KEYVAL_PATH,
  },
  token: {
    secret: process.env.TOKEN_SECRET,
  }
};

module.exports = config;
