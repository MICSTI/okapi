const express = require('express');

const config = require('./config');
const logger = require('./logger');

const app = express();

const { port } = config.app;
app.listen(port, () => logger.log('info', `okapi running on port ${port}`));

module.exports = app;
