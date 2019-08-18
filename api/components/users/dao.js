const jsonPatch = require('fast-json-patch');

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
  const userId = cryptoUtil.createRandomString();
  user[userModel.constants.KEY_ID] = userId;

  const dataObj = userModel.initDataObject(user);
  const metaObj = userModel.initMetaObject(user);
  const dataHash = calculateDataHash(dataObj);

  setUserData(userId, dataObj);
  setUserMeta(userId, metaObj);
  setUserContentHash(userId, dataHash);

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

const setUserContentHash = (userId, hash) => {
  store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), hash);
};

const getUserContentHash = userId => {
  return store.get(userModel.getCompositeKey(userModel.constants.HASH, userId));
};

const updateUserData = (userId, patch) => {
  // validate the patch object => make sure that no reserved properties are changed
  const validatedPatch = validatePatchObj(patch);

  // prepare the patch object => replace object IDs with actual indizes
  const preparedPatch = preparePatchObj(userId, validatedPatch);

  const dataObj = getUserData(userId);
  const updatedDataObj = jsonPatch.applyPatch(dataObj, preparedPatch).newDocument;

  setUserData(userId, updatedDataObj);

  const hash = calculateDataHash(updatedDataObj);
  setUserContentHash(userId, hash);
  
  return hash;
};

const validatePatchObj = patch => {
  // make sure that none of the reserved top-level properties are changed/overwritten/deleted/moved

  // TODO implement
  return patch;
}

const preparePatchObj = (userId, patch) => {
  // a "path" property containing something like this will be substituted to the actual array index
  // { ..., path: "/contacts/:OBJECT_ID/firstName", ... } -> { ..., path: "/contacts/7/firstName", ... }

  // TODO implement
  return patch;
};

module.exports = {
  createUser,
  getUserContentHash,
  updateUserData,
  validateCredentials,
};
