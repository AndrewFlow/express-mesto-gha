const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED,
  UNAUTHORIZED_MESSAGE,
} = require('../constants/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(UNAUTHORIZED).send({ message: UNAUTHORIZED_MESSAGE });
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: UNAUTHORIZED_MESSAGE });
  }
  req.user = payload;

  next();
};
