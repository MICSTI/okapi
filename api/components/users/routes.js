const router = require('express').Router();
const accessControl = require('../../middlewares/accessControl');
const logger = require('../../../logger');
const userDao = require('./dao');
const userModel = require('./model');
const errorHandler = require('../../controllers/errorHandler');
const HTTP_STATUSES = require('../../constants/http');

router.post('/', async (req, res, next) => {
  const userObj = req.body.user;

  if (!userObj) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, "Missing mandatory body parameter 'user'"));
  }

  if (await userDao.emailExists(userObj[userModel.constants.KEY_EMAIL])) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, "A user with this email address already exists"));
  }

  try {
    const user = await userDao.createUser(userObj);

    return res.status(HTTP_STATUSES.CREATED).json(user);
  } catch (ex) {
    logger.log('error', `failed to create user: ${ex}`);
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, ex.message));
  }
});

router.delete('/', accessControl.protect(), async (req, res, next) => {
  const userId = req.user.id;

  try {
    await userDao.deleteUser(userId);

    return res.status(HTTP_STATUSES.NO_CONTENT).json();
  } catch (ex) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, ex.message));
  }
});

module.exports = router;
