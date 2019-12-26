const router = require('express').Router();

const accessControl = require('../../middlewares/accessControl');
const contentDao = require('./dao');
const userDao = require('../users/dao');
const errorHandler = require('../../controllers/errorHandler');
const HTTP_STATUSES = require('../../constants/http');

router.get('/data', accessControl.protect(), (req, res, next) => {
  const userId = req.user.id;

  const data = userDao.getUserDataBase64(userId);
  const hash = userDao.getUserContentHash(userId);

  return res.status(HTTP_STATUSES.OK).json({
    data,
    hash
  });
});

router.get('/hash', accessControl.protect(), (req, res, next) => {
  const hash = userDao.getUserContentHash(req.user.id);

  if (!hash) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, "No hash available for this user"));
  }

  return res.status(HTTP_STATUSES.OK).json({
    hash,
  });
});

router.post('/update', accessControl.protect(), (req, res, next) => {
  const patch = req.body.patch;

  if (!patch) {
    return next(errorHandler.createError(400, "Missing mandatory body parameter 'patch'"));
  }

  const userId = req.user.id;

  try {
    const failedOperations = contentDao.updateData(userId, patch);

    if (failedOperations.length > 0) {
      return res.status(HTTP_STATUSES.BAD_REQUEST).json({
        failedOperations,
      })
    }

    const newHash = userDao.getUserContentHash(userId);
    return res.status(HTTP_STATUSES.OK).json({
      newHash,
    });
  } catch (err) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, err.message));
  }
});

module.exports = router;
