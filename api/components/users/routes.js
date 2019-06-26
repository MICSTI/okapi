const router = require('express').Router();
const userDao = require('./dao');

router.post('/create', (req, res, next) => {
  const user = {
    id: 'abc',
    getMetaData: () => {
      return {
        username: 'test',
        salt: 'salty',
        password: '4frslö453',
      };
    },
    getHash: () => {
      return 'xyzabcdef';
    }
  }

  userDao.createUser(user);

  return res.status(201).send("Alright!");
});

module.exports = router;
