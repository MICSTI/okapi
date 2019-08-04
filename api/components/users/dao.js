const userModel = require('./model');
const store = require('../../../db');

const createUser = (userObj) => {
  // filter the incoming JSON object
  const user = filterJsonInputCreateUser(userObj);
  
  const userId = user.id;

  store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), userModel.getEmptyDataObject());
  store.set(userModel.getCompositeKey(userModel.constants.META, userId), user.getMetaData());
  store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), user.getHash());
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

module.exports = {
  createUser,
}
