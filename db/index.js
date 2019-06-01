const mongoose = require('mongoose');

const config = require('../config');
const logger = require('../logger');

const {
  host, port, user, pass, database,
} = config.db;

const authInfo = [];

if (user) {
  authInfo.push(user);
}

if (pass) {
  authInfo.push(pass);
}

let authPart = authInfo.join(':');
if (authPart.length > 0) {
  authPart += '@';
}

const dbConnectionUrl = `mongodb://${authPart}${host}:${port}/${database}`;

mongoose.connect(dbConnectionUrl, (err) => {
  if (err) {
    throw Error('Failed to connect to MongoDb');
  }

  logger.log('info', 'Successfully connected to database');
});

module.exports = mongoose;
