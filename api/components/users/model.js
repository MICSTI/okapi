const constants = {
  DATA: 'data',
  META: 'meta',
  HASH: 'hash',
  PLACEHOLDER_USER_ID: '{{USER_ID}}',
  DB_KEY_COMPOSITE_DATA: 'user:{{USER_ID}}:data',
  DB_KEY_COMPOSITE_META: 'user:{{USER_ID}}:meta',
  DB_KEY_COMPOSITE_HASH: 'user:{{USER_ID}}:hash',

  KEY_CONTACTS: 'contacts',
  KEY_ID: 'id',
  KEY_EMAIL: 'email',
  KEY_FIRST_NAME: 'firstName',
  KEY_LAST_NAME: 'lastName',
  KEY_RELATIONSHIPS: 'relationships',
  KEY_SELF: 'self',
  KEY_SETTINGS: 'settings',
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

const initNewDataObject = (userId) => {
  return {
    [constants.KEY_SELF]: {
      [constants.KEY_ID]: userId,
    },
    [constants.KEY_SETTINGS]: {},
    [constants.KEY_CONTACTS]: [],
    [constants.KEY_RELATIONSHIPS]: [],
  };
}

module.exports = {
  constants,
  initNewDataObject,
  getCompositeKey,
};
