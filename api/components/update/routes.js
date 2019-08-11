const router = require('express').Router();

router.post('/', (req, res, next) => {
  return res.status(200).send("Alright!");
}); 

module.exports = router;
