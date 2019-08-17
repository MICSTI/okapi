const userModel = require('./model');
const store = require('../../../db');
const cryptoUtil = require('../../../util/crypto');

const createUser = (userObj) => {
  // filter the incoming JSON object
  const user = filterJsonInputCreateUser(userObj);

  // assign a unique user ID
  const userId = cryptoUtil.createRandomString();
  user[userModel.constants.KEY_ID] = userId;

  const dataObj = userModel.initDataObject(user);
  const metaObj = userModel.initMetaObject(user);

  store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), dataObj);
  store.set(userModel.getCompositeKey(userModel.constants.META, userId), metaObj);
  store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), "calculated hash");

  return dataObj;
};

const validateCredentials = (username, password) => {
  let user;

  // get all 'meta' user keys from the store
  // TODO change this to a more performant approach (using wildcards in Redis?)
  const storeKeys = store.keys().filter(key => key.endsWith(userModel.constants.META));

  // TODO change to regular for loop
  storeKeys.forEach(key => {
    // no need to continue if we already found the user
    if (user) {
      return;
    }

    const userObj = store.get(key);

    if (userObj[userModel.constants.KEY_EMAIL] !== username) {
      return;
    }

    // TODO perform password check with crypto util
    user = {
      id: userObj[userModel.constants.KEY_ID],
    };
  });

  return user;
};

const filterJsonInputCreateUser = (userJson) => {
  const allowedProperties = [
    userModel.constants.KEY_FIRST_NAME,
    userModel.constants.KEY_LAST_NAME,
    userModel.constants.KEY_EMAIL,
  ];

  const filteredObj = {};

  for (let [key, value] of Object.entries(userJson)) {
    if (allowedProperties.includes(key)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
};

const validateCreateUserObj = (userObj) => {
  // TODO implement check if all necessary properties are there
  return true;
};

const getUserContentHash = (userId) => {
  return store.get(userModel.getCompositeKey(userModel.constants.HASH, userId));
};

module.exports = {
  createUser,
  getUserContentHash,
  validateCredentials,
}
