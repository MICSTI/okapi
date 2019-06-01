// use `dotenv` package to load app configuration to environment vars
require('dotenv').config();

const config = {
  app: {
    port: process.env.APP_PORT,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};

module.exports = config;
