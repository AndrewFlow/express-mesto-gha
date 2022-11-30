const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const {
  UNAUTHORIZED_MESSAGE,
} = require('../constants/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new Unauthorized(UNAUTHORIZED_MESSAGE);
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new Unauthorized(UNAUTHORIZED_MESSAGE));
  }
  req.user = payload;

  return next();
};
