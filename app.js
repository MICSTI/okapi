const express = require('express');

const config = require('./config');
const logger = require('./logger');
const api = require('./api');

const app = express();
api.initApp(app);

const { id, port } = config.app;
app.listen(port, () => logger.log('info', `${id} running on port ${port}`));

const db = require('./db');

module.exports = app;
