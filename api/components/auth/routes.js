const router = require('express').Router();
const errorHandler = require('../../controllers/errorHandler');
const tokenService = require('../../controllers/token');
const userDao = require('../../components/users/dao');
const HTTP_STATUSES = require('../../constants/http');

router.post('/token', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(errorHandler.createError(HTTP_STATUSES.BAD_REQUEST, "Missing username and/or password body property"));
  }

  const user = await userDao.validateCredentials(username, password);

  if (!user) {
    return next(errorHandler.createError(HTTP_STATUSES.UNAUTHORIZED, "Invalid login credentials"));
  }

  return res.status(HTTP_STATUSES.OK).send(tokenService.getToken(user));
});

module.exports = router;
