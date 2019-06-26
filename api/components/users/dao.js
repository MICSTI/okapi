const userModel = require('./model');
const store = require('../../../db');

const createUser = (user) => {
  const userId = user.id;

  store.set(userModel.getCompositeKey(userModel.constants.DATA, userId), userModel.getEmptyDataObject());
  store.set(userModel.getCompositeKey(userModel.constants.META, userId), user.getMetaData());
  store.set(userModel.getCompositeKey(userModel.constants.HASH, userId), user.getHash());
};

module.exports = {
  createUser,
}
