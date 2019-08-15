const router = require('express').Router();
const errorHandler = require('../../controllers/errorHandler');
const tokenService = require('../../controllers/token');

router.post('/token', (req, res, next) => {
  // TODO validate user credentials
  const user = {
    id: 'qwerty',
  };

  return res.status(200).send(tokenService.getToken(user));
});

module.exports = router;
