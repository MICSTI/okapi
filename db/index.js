const config = require('../config');
const logger = require('../logger');
const db = require('./keyval');
const FILE_PATH = config.db.devKeyvalStore;

db.init(FILE_PATH)
  .then(() => {
    logger.log('info', 'Database initialized');
  });

module.exports = db;
