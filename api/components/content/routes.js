const router = require('express').Router();
const accessControl = require('../../middlewares/accessControl');
const userDao = require('../users/dao');
const errorHandler = require('../../controllers/errorHandler');

router.post('/ping', accessControl.protect, (req, res, next) => {
  const hash = userDao.getUserContentHash(req.user.id);

  if (!hash) {
    return next(errorHandler.createError(400, "No hash available for this user"));
  }

  return res.status(200).send(hash);
});

router.post('/update', accessControl.protect, (req, res, next) => {
  return res.status(200).send("Alright!");
}); 

module.exports = router;
