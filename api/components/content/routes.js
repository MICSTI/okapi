const router = require('express').Router();
const accessControl = require('../../middlewares/accessControl');
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

  try {
    const newHash = userDao.updateUserData(req.user.id, patch);

    return res.status(200).json({
      newHash,
    });
  } catch (err) {
    return next(errorHandler.createError(400, err.message));
  }
});

module.exports = router;
