const router = require('express').Router();

const accessControl = require('../../middlewares/accessControl');
const contentDao = require('./dao');
const userDao = require('../users/dao');
const errorHandler = require('../../controllers/errorHandler');

router.get('/data', accessControl.protect(), (req, res, next) => {
  const userId = req.user.id;

  const data = userDao.getUserDataBase64(userId);
  const hash = userDao.getUserContentHash(userId);

  return res.status(200).json({
    data,
    hash
  });
});

router.post('/ping', accessControl.protect(), (req, res, next) => {
  const hash = userDao.getUserContentHash(req.user.id);

  if (!hash) {
    return next(errorHandler.createError(400, "No hash available for this user"));
  }

  return res.status(200).json({
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
      return res.status(400).json({
        success: false,
        failedOperations,
      })
    }

    const newHash = userDao.getUserContentHash(userId);
    return res.status(200).json({
      success: true,
      newHash,
    });
  } catch (err) {
    return next(errorHandler.createError(400, err.message));
  }
});

module.exports = router;
