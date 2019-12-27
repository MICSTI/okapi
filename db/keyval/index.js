/**
 * This is simply a basic implementation of a key-value store that gets persisted to disk.
 * Its purpose is only to mimick a Redis instance or similar key-value store, 
 * which definitely should be used for production purposes.
 */

const fs = require('fs');

let initialized = false;
let store = null;
let filePath = null;

let logger = null;

const ERROR_MSG_ALREADY_INITIALIZED = 'Store is already initialized! You cannot call init() again';
const ERROR_MSG_NOT_INITIALIZED = 'Store not initialized! Make sure to call init() first';

const setLogger = (loggerInstance) => {
  logger = loggerInstance;
};

const log = (level, message) => {
  if (logger) {
    logger.log(level, message);
  }
};

const load = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }

      try {
        resolve(JSON.parse(data));
      } catch (ex) {
        reject(ex);
      }
    });
  });
};

const persist = () => {
  return new Promise((resolve, reject) => {
    if (!initialized) {
      return reject(ERROR_MSG_NOT_INITIALIZED);
    }

    fs.writeFile(filePath, JSON.stringify(store), (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    })
  });
};

const init = (path) => {
  return new Promise((resolve, reject) => {
    if (initialized) {
      return reject(ERROR_MSG_ALREADY_INITIALIZED);
    }

    filePath = path;

    load()
      .then(data => {
        store = data;
        initialized = true;
        resolve();
      })
      .catch(err => {
        log('info', 'failed to init store from path - using empty store instead');

        // init empty database object
        store = {};
        initialized = true;
        resolve();
      });
  });
};

const set = (key, value) => {
  if (!initialized) {
    throw new Error(ERROR_MSG_NOT_INITIALIZED);
  }

  store[key] = value;
};

const get = key => {
  if (!initialized) {
    throw new Error(ERROR_MSG_NOT_INITIALIZED);
  }

  return store[key];
};

const keys = () => {
  if (!initialized) {
    throw new Error(ERROR_MSG_NOT_INITIALIZED);
  }

  return Object.keys(store);
};

const unset = key => {
  if (!initialized) {
    throw new Error(ERROR_MSG_NOT_INITIALIZED);
  }

  delete store[key];
};

const publicApi = {
  init,
  set,
  get,
  keys,
  unset,
  setLogger,
};

module.exports = publicApi;
