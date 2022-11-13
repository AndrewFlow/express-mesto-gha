const router = require('express').Router();

const RESOURCE_NOT_FOUND = 'Ресурс не найден';

router.all('*', (req, res) => {
  res.status(404).send({ message: RESOURCE_NOT_FOUND });
});

module.exports = router;
