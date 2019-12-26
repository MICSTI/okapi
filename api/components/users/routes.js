const router = require('express').Router();
const userDao = require('./dao');
const errorHandler = require('../../controllers/errorHandler');
const HTTP_STATUSES = require('../../constants/http');

router.post('/', (req, res, next) => {
  const userObj = req.body.user;

  if (!userObj) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, "Missing mandatory body parameter 'user'"));
  }

  try {
    const user = userDao.createUser(userObj);

    return res.status(HTTP_STATUSES.CREATED).json(user);
  } catch (ex) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, ex.message));
  }
});

module.exports = router;
