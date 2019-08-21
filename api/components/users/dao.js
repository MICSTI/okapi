const jsonPatch = require('fast-json-patch');

const userModel = require('./model');
const store = require('../../../db');
const cryptoUtil = require('../../../util/crypto');

const PATCH_KEY_OP = 'op';
const PATCH_KEY_PATH = 'path';
const PATCH_KEY_VALUE = 'value';

const validPathStarts = [
  '/' + userModel.constants.KEY_CONTACTS + '/',
  '/' + userModel.constants.KEY_SETTINGS + '/',
  '/' + userModel.constants.KEY_RELATIONSHIPS + '/',
];

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

const updateUserData = (userId, patch) => {
  const patchArr = ensurePatchIsArray(patch);

  // validate the patch object => make sure that no reserved properties are changed
  validatePatchObj(patchArr);

  // prepare the patch object => replace object IDs with actual indizes
  preparePatchArr(userId, patchArr);

  const dataObj = getUserData(userId);
  const updatedDataObj = jsonPatch.applyPatch(dataObj, patchArr).newDocument;

  setUserData(userId, updatedDataObj);

  const hash = calculateDataHash(updatedDataObj);
  setUserContentHash(userId, hash);
  
  return hash;
};

const ensurePatchIsArray = patch => {
  return Array.isArray(patch) ? patch : [patch];
};

const validatePatchObj = patchArr => {
  const mandatoryProps = [
    PATCH_KEY_OP,
    PATCH_KEY_PATH,
    PATCH_KEY_VALUE,
  ];

  // make sure that none of the reserved top-level properties are changed/overwritten/deleted/moved
  const invalidPaths = [
    '/' + userModel.constants.KEY_CONTACTS,
    '/' + userModel.constants.KEY_CONTACTS + '/',
    '/' + userModel.constants.KEY_SETTINGS,
    '/' + userModel.constants.KEY_SETTINGS + '/',
    '/' + userModel.constants.KEY_SELF,
    '/' + userModel.constants.KEY_SELF + '/',
    '/' + userModel.constants.KEY_RELATIONSHIPS,
    '/' + userModel.constants.KEY_RELATIONSHIPS + '/',
  ];

  for (let patchOp of patchArr) {
    if (typeof patchOp !== 'object') {
      throw new Error('Patch must be of type object');
    }

    for (let mandatoryProp of mandatoryProps) {
      if (!patchOp.hasOwnProperty(mandatoryProp)) {
        throw new Error('Missing mandatory patch property ' + mandatoryProp);
      }
    }

    const patchPath = patchOp[PATCH_KEY_PATH];

    // technically it's legal to start the path without a slash, but we disallow it
    // for application-specific data management purposes
    if (!patchPath.startsWith('/')) {
      throw new Error('Paths must start with /');
    }

    if (!checkValidPathStart(patchPath)) {
      throw new Error('Illegal path start: ' + patchPath);
    }

    if (invalidPaths.includes(patchPath)) {
      throw new Error('Illegal patch path: ' + patchPath);
    }
  }
};

const checkValidPathStart = patchPath => {
  for (let validPathStart of validPathStarts) {
    if (patchPath.startsWith(validPathStart)) {
      return true;
    }
  }

  return false;
};

const preparePatchArr = (userId, patchArr) => {
  for (let patchObj of patchArr) {
    preparePatchObj(userId, patchObj);
  }
}

const preparePatchObj = (userId, patch) => {
  // a "path" property containing something like this will be substituted to the actual array index
  // { ..., path: "/contacts/:OBJECT_ID/firstName", ... } -> { ..., path: "/contacts/7/firstName", ... }
  let path = patch[PATCH_KEY_PATH];

  while (path.includes(':')) {
    // cut the object ID from the string
    let startPos = path.indexOf(':');
    let endPos = path.indexOf('/', startPos);

    if (endPos < startPos) {
      throw new Error('Malformed path: ' + path);
    }

    // we need to add (and remove) one to the start position because of the ":"
    const objectId = path.substr(startPos + 1, (endPos - startPos - 1));

    // TODO implement lookup in data store
    const arrIdx = 0;

    // replace the object ID with the array index
    path = path.replace(':' + objectId, arrIdx);
  }

  patch[PATCH_KEY_PATH] = path;

  return patch;
};

module.exports = {
  createUser,
  getUserContentHash,
  getUserDataBase64,
  updateUserData,
  validateCredentials,
};
