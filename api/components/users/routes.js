const router = require('express').Router();
const userDao = require('./dao');
const errorHandler = require('../../controllers/errorHandler');

router.post('/create', (req, res, next) => {
  const userObj = req.body.user;

  if (!userObj) {
    return next(errorHandler.createError(400, "Missing mandatory body parameter 'user'"));
  }

  try {
    const user = userDao.createUser(userObj);

    return res.status(201).json(user);
  } catch (ex) {
    return next(errorHandler.createError(400, ex.message));
  }
});

module.exports = router;
