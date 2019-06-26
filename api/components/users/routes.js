const router = require('express').Router();

router.post('/create', (req, res, next) => {
  res.status(200).send("HI");
});

module.exports = router;
