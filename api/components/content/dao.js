const jsonPatch = require('fast-json-patch');

const commonUtil = require('../../../util/common');
const userDao = require('../users/dao');
const userModel = require('../users/model');

const PATCH_KEY_ID = 'id';
const PATCH_KEY_OP = 'op';
const PATCH_KEY_PATH = 'path';
const PATCH_KEY_VALUE = 'value';
const PATCH_KEY_REASON = 'reason';

const mandatoryPatchProps = [
  PATCH_KEY_ID,
  PATCH_KEY_OP,
  PATCH_KEY_PATH,
  PATCH_KEY_VALUE,
];

const validPathStarts = [
  '/' + userModel.constants.KEY_CONTACTS + '/',
  '/' + userModel.constants.KEY_SETTINGS + '/',
  '/' + userModel.constants.KEY_RELATIONSHIPS + '/',
];

const preparePatchOperation = (userId, patch) => {
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

    const userData = userDao.getUserData(userId);

    // we need to add (and remove) one to the start position because of the ":"
    const objectId = path.substr(startPos + 1, (endPos - startPos - 1));

    const pathUntilObjectId = path.substr(0, startPos);
    const searchArray = commonUtil.lookupObjectPathValue(userData, pathUntilObjectId);
    const idIdx = commonUtil.lookupArrayElementIdx(searchArray, 'id', objectId);

    if (idIdx < 0) {
      throw new Error("Object ID not found: " + objectId);
    }

    // replace the object ID with the array index
    path = path.replace(':' + objectId, idIdx);
  }

  patch[PATCH_KEY_PATH] = path;

  return patch;
};

const updateData = (userId, patch) => {
  const patchArr = ensurePatchIsArray(patch);

  // validate the patch object => make sure that no reserved properties are changed
  validatePatchObj(patchArr);

  let dataObj = userDao.getUserData(userId);
  const failedOps = [];

  let successStatus = true;
  for (const patchOperation of patchArr) {
    if (!successStatus) {
      patchOperation[PATCH_KEY_REASON] = "Previous operation failed";
      failedOps.push(patchOperation);
      continue;
    }

    try {
      // prepare the patch object => replace object IDs with actual indizes
      preparePatchOperation(userId, patchOperation);

      dataObj = jsonPatch.applyOperation(dataObj, patchOperation).newDocument;
    } catch (err) {
      successStatus = false;
      
      patchOperation[PATCH_KEY_REASON] = err.message;
      failedOps.push(patchOperation);
    }
  }

  userDao.setUserData(userId, dataObj);

  const hash = userDao.calculateDataHash(dataObj);
  userDao.setUserContentHash(userId, hash);
  
  return failedOps;
};

const ensurePatchIsArray = patch => {
  return Array.isArray(patch) ? patch : [patch];
};

const validatePatchObj = patchArr => {
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

  for (const patchOp of patchArr) {
    if (typeof patchOp !== 'object') {
      throw new Error('Patch must be of type object');
    }

    for (const mandatoryProp of mandatoryPatchProps) {
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

module.exports = {
  updateData,
};
