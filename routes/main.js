const router = require('express').Router();
const {
  RESOURCE_NOT_FOUND,
  RESOURCE_NOT_FOUND_MESSAGE,
} = require('../constants/constants');

router.all('*', (req, res) => {
  res.status(RESOURCE_NOT_FOUND).send({ message: RESOURCE_NOT_FOUND_MESSAGE });
});

module.exports = router;
