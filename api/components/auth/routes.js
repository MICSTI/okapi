const router = require('express').Router();
const errorHandler = require('../../controllers/errorHandler');
const tokenService = require('../../controllers/token');
const userDao = require('../../components/users/dao');

router.post('/token', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(errorHandler.createError(400, "Missing username and/or password body property"));
  }

  const user = userDao.validateCredentials(username, password);

  if (!user) {
    return next(errorHandler.createError(401, "Invalid login credentials"));
  }

  return res.status(200).send(tokenService.getToken(user));
});

module.exports = router;
