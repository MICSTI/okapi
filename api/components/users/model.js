/*
  For one user, there are always three objects store in the database:

  user:USER_ID:meta
  user:USER_ID:data
  user:USER_ID:hash
  
  Meta object:
  {
    "active": boolean,                // determines whether user account is active or not
    "firstName": String,              // first name
    "lastName": String,               // last name
    "email": String,                  // email address
    "salt": String,                   // password salt
    "password": String,               // SHA-512 value of salt and actual password
    "passwordResetToken": Token,      // token for resetting password
    "accountActivationToken": Token,  // token for activating account
  }

  Token object:
  {
    "value": String,                  // value of token
    "expires": Date,                  // expiry date of token
  }

  Data object:
  {
    "contacts": [
      {                               // the first contact element is the special "self" element
        "id": "self",                 // is used for storing user-specific settings
        "settings": [{
          "id": ObjectId,
          "key": "value"
        }, {
          "id": ObjectId,
          "key2": "value"
        }],
      {
        "id": ObjectId,
        // arbitrary key-value settings (can also be nested)
      }
    ],
    "relationships": [
      {
        "id": ObjectId,
        "participants": [
          CONTACT_ID,
          CONTACT_ID
        ],
        "type": ???,
        "anniversaries": [
          {
            "id": ObjectId,
            "date": DATE,
          }
        ]
      }
    ]
  }
*/

const constants = {
  CONFIG_USER_ID_LENGTH: 24,
  CONFIG_SALT_LENGTH: 40,

  DATA: 'data',
  META: 'meta',
  HASH: 'hash',
  PLACEHOLDER_USER_ID: '{{USER_ID}}',
  DB_KEY_COMPOSITE_DATA: 'user:{{USER_ID}}:data',
  DB_KEY_COMPOSITE_META: 'user:{{USER_ID}}:meta',
  DB_KEY_COMPOSITE_HASH: 'user:{{USER_ID}}:hash',

  KEY_ACTIVE: 'active',
  KEY_CONTACTS: 'contacts',
  KEY_ID: 'id',
  KEY_EMAIL: 'email',
  KEY_FIRST_NAME: 'firstName',
  KEY_LAST_NAME: 'lastName',
  KEY_PASSWORD: 'password',
  KEY_RELATIONSHIPS: 'relationships',
  KEY_SALT: 'salt',
  KEY_SELF: 'self',
  KEY_SETTINGS: 'settings',
};

const allowedCreateProps = [
  constants.KEY_EMAIL,
  constants.KEY_FIRST_NAME,
  constants.KEY_LAST_NAME,
  constants.KEY_PASSWORD,
];

const mandatoryCreateProps = [
  constants.KEY_EMAIL,
  constants.KEY_FIRST_NAME,
  constants.KEY_PASSWORD,
];

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

const initDataObject = (user) => {
  return {
    [constants.KEY_CONTACTS]: [{
      [constants.KEY_ID]: constants.KEY_SELF,
      [constants.KEY_LAST_NAME]: user.KEY_LAST_NAME,
      [constants.KEY_FIRST_NAME]: user.KEY_FIRST_NAME,
      [constants.KEY_SETTINGS]: [],
    }],
    [constants.KEY_RELATIONSHIPS]: [],
  };
};

const initMetaObject = (user) => {
  const metaObj = {};

  // TODO user should not be active by default
  metaObj[constants.KEY_ACTIVE] = true;
  metaObj[constants.KEY_EMAIL] = user[constants.KEY_EMAIL];
  metaObj[constants.KEY_FIRST_NAME] = user[constants.KEY_FIRST_NAME];
  metaObj[constants.KEY_LAST_NAME] = user[constants.KEY_LAST_NAME];

  // salt and password will be set later
  metaObj[constants.KEY_SALT] = null;
  metaObj[constants.KEY_PASSWORD] = null;

  return metaObj;
};

module.exports = {
  allowedCreateProps,
  constants,
  initDataObject,
  initMetaObject,
  getCompositeKey,
  mandatoryCreateProps,
};
