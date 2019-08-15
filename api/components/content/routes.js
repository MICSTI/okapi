const router = require('express').Router();

router.post('/ping', (req, res, next) => {
  return res.status(200).send("Alright!");
});

router.post('/update', (req, res, next) => {
  return res.status(200).send("Alright!");
}); 

module.exports = router;
