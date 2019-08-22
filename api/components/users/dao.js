const userModel = require('./model');
const store = require('../../../db');
const cryptoUtil = require('../../../util/crypto');

const createUser = (userObj) => {
  // filter the incoming JSON object
  const user = filterJsonInputCreateUser(userObj);

  // validate the incoming JSON object
  const missingProps = validateCreateUserObj(userObj);

  if (missingProps.length !== 0) {
    throw new Error("Missing mandatory properties: " + missingProps.join(', '));
  }

  // assign a unique user ID
  const userId = cryptoUtil.createRandomString(userModel.constants.CONFIG_USER_ID_LENGTH);
  user[userModel.constants.KEY_ID] = userId;

  const dataObj = userModel.initDataObject(user);
  const metaObj = userModel.initMetaObject(user);
  const dataHash = calculateDataHash(dataObj);

  // use crypto util to set salt and hashed password
  const salt = cryptoUtil.createRandomString(userModel.constants.CONFIG_SALT_LENGTH);
  const password = user.password;
  const hashedPassword = cryptoUtil.getPasswordHash(salt, password);

  // TODO refactor this? to reuse with change password
  metaObj[userModel.constants.KEY_SALT] = salt;
  metaObj[userModel.constants.KEY_PASSWORD] = hashedPassword;

  setUserData(userId, dataObj);
  setUserMeta(userId, metaObj);
  setUserContentHash(userId, dataHash);

  return dataObj;
};

const validateCredentials = (username, password) => {
  // get all 'meta' user keys from the store
  // TODO change this to a more performant approach (using wildcards in Redis?)
  const storeKeys = store.keys().filter(key => key.endsWith(userModel.constants.META));

  for (let key of storeKeys) {
    const userObj = store.get(key);

    if (userObj[userModel.constants.KEY_EMAIL] === username &&
          userObj[userModel.constants.KEY_ACTIVE] === true) {

      const userId = userObj[userModel.constants.KEY_ID];

      const userMeta = getUserMeta(userId);
      const salt = userMeta[userModel.constants.KEY_SALT];
      const hashedPassword = cryptoUtil.getPasswordHash(salt, password);
      const hashedPasswordToCompare = userMeta[userModel.constants.KEY_PASSWORD];

      if (hashedPassword === hashedPasswordToCompare) {
        return {
          id: userId,
        };
      }

      return null;
    }
  }
  
  return null;
};

const filterJsonInputCreateUser = (userJson) => {
  const allowedProperties = [
    userModel.constants.KEY_FIRST_NAME,
    userModel.constants.KEY_LAST_NAME,
    userModel.constants.KEY_EMAIL,
    userModel.constants.KEY_PASSWORD,
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
  return [];
};

const calculateDataHash = dataObj => {
  return cryptoUtil.getObjectHashSha256(dataObj);
};

const setUserMeta = (userId, metaObj) => {
  store.set(userModel.getCompositeKey(userModel.constants.META, userId), metaObj);
};

const getUserMeta = userId => {
  return store.get(userModel.getCompositeKey(userModel.constants.META, userId));
};

const setUserData = (userId, dataObj) => {
  store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), dataObj);
};

const getUserData = userId => {
  return store.get(userModel.getCompositeKey(userModel.constants.DATA, userId));
};

const getUserDataBase64 = userId => {
  return cryptoUtil.encodeBase64(getUserData(userId));
};

const setUserContentHash = (userId, hash) => {
  store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), hash);
};

const getUserContentHash = userId => {
  return store.get(userModel.getCompositeKey(userModel.constants.HASH, userId));
};

module.exports = {
  calculateDataHash,
  createUser,
  getUserContentHash,
  getUserData,
  getUserDataBase64,
  setUserContentHash,
  setUserData,
  validateCredentials,
};
