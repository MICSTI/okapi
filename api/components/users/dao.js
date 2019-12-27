const userModel = require('./model');
const store = require('../../../db');
const cryptoUtil = require('../../../util/crypto');

const createUser = async (userObj) => {
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

  await setUserData(userId, dataObj);
  await setUserMeta(userId, metaObj);
  await setUserContentHash(userId, dataHash);

  return getUserDataAndHash(userId);
};

const deleteUser = async (userId) => {
  await unsetUserData(userId);
  await unsetUserMeta(userId);
  await unsetUserContentHash(userId);
};

const validateCredentials = async (username, password) => {
  // get all 'meta' user keys from the store
  // TODO change this to a more performant approach (using wildcards in Redis?)
  const allStoreKeys = await store.keys();
  const storeKeys = allStoreKeys.filter(key => key.endsWith(userModel.constants.META));

  for (let key of storeKeys) {
    const userObj = await store.get(key);

    if (userObj[userModel.constants.KEY_EMAIL] === username &&
          userObj[userModel.constants.KEY_ACTIVE] === true) {

      const userId = userObj[userModel.constants.KEY_ID];

      const userMeta = await getUserMeta(userId);
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
  const allowedProperties = userModel.allowedCreateProps;

  const filteredObj = {};

  for (let [key, value] of Object.entries(userJson)) {
    if (allowedProperties.includes(key)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
};

const validateCreateUserObj = userObj => {
  const missingProps = [];

  for (const prop of userModel.mandatoryCreateProps) {
    if (typeof userObj[prop] === 'undefined') {
      missingProps.push(prop);
    }
  }

  return missingProps;
};

const calculateDataHash = dataObj => {
  return cryptoUtil.getObjectHashSha256(dataObj);
};

const setUserMeta = async (userId, metaObj) => {
  return store.set(userModel.getCompositeKey(userModel.constants.META, userId), metaObj);
};

const getUserMeta = async (userId) => {
  return store.get(userModel.getCompositeKey(userModel.constants.META, userId));
};

const unsetUserMeta = async (userId) => {
  return store.unset(userModel.getCompositeKey(userModel.constants.META, userId));
};

const setUserData = async (userId, dataObj) => {
  return store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), dataObj);
};

const getUserData = async (userId) => {
  return store.get(userModel.getCompositeKey(userModel.constants.DATA, userId));
};

const unsetUserData = async (userId) => {
  return store.unset(userModel.getCompositeKey(userModel.constants.DATA, userId));
};

const getUserDataBase64 = async (userId) => {
  const userData = await getUserData(userId);
  return cryptoUtil.encodeBase64(userData);
};

const setUserContentHash = async (userId, hash) => {
  return store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), hash);
};

const getUserContentHash = async (userId) => {
  return store.get(userModel.getCompositeKey(userModel.constants.HASH, userId));
};

const unsetUserContentHash = async (userId) => {
  return store.unset(userModel.getCompositeKey(userModel.constants.HASH, userId));
}

const getUserDataAndHash = async (userId) => {
  const data = await getUserDataBase64(userId);
  const hash = await getUserContentHash(userId);

  return {
    data,
    hash,
  };
};

module.exports = {
  calculateDataHash,
  createUser,
  deleteUser,
  getUserContentHash,
  getUserData,
  getUserDataAndHash,
  getUserDataBase64,
  setUserContentHash,
  setUserData,
  validateCredentials,
};
