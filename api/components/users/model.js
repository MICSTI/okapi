const constants = {
  DATA: 'data',
  META: 'meta',
  HASH: 'hash',
  PLACEHOLDER_USER_ID: '{{USER_ID}}',
  DB_KEY_COMPOSITE_DATA: 'user:{{USER_ID}}:data',
  DB_KEY_COMPOSITE_META: 'user:{{USER_ID}}:meta',
  DB_KEY_COMPOSITE_HASH: 'user:{{USER_ID}}:hash',
};

const getCompositeKey = (type, userId) => {
  switch (type) {
    case constants.DATA:
      return constants.DB_KEY_COMPOSITE_DATA.replace(constants.PLACEHOLDER_USER_ID, userId);
    case constants.META:
      return constants.DB_KEY_COMPOSITE_META.replace(constants.PLACEHOLDER_USER_ID, userId);
    case constants.HASH:
      return constants.DB_KEY_COMPOSITE_HASH.replace(constants.PLACEHOLDER_USER_ID, userId);
    default:
      return null;
  }
};

const getEmptyDataObject = () => {
  return {
    settings: {},
    contacts: [],
    relationships: [],
  };
}

const createFromJson = (userJson) => {
  // TODO implement
};

module.exports = {
  constants,
  getEmptyDataObject,
  getCompositeKey,
};
