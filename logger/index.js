const Winston = require('winston');

// eslint-disable-next-line new-cap
const logger = new Winston.createLogger({
  level: 'info',
  format: Winston.format.json(),
  transports: [
    new (Winston.transports.Console)(),
  ],
});

module.exports = logger;
