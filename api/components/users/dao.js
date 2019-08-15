const userModel = require('./model');
const store = require('../../../db');
const cryptoUtil = require('../../../util/crypto');

const createUser = (userObj) => {
  // filter the incoming JSON object
  const user = filterJsonInputCreateUser(userObj);

  // assign a unique user ID
  const userId = cryptoUtil.createRandomString();

  store.set('hello', userId);

  //store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), userModel.getEmptyDataObject());
  //store.set(userModel.getCompositeKey(userModel.constants.META, userId), user.getMetaData());
  //store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), user.getHash());
};

const filterJsonInputCreateUser = (userJson) => {
  const allowedProperties = [
    userModel.constants.JSON_KEY_FIRST_NAME,
    userModel.constants.JSON_KEY_LAST_NAME,
    userModel.constants.JSON_KEY_EMAIL,
  ];

  const filteredObj = {};

  for (let [key, value] of Object.entries(userJson)) {
    if (allowedProperties.includes(key)) {
      filteredObj[key] = value;
    }
  }

  return filteredObj;
};

const getUserContentHash = (userId) => {
  return store.get(userModel.getCompositeKey(userModel.constants.HASH, userId));
};

module.exports = {
  createUser,
  getUserContentHash,
}
