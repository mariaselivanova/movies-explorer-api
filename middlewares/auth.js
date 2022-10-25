require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { authErrorText } = require('../config/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(authErrorText);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new AuthError(authErrorText));
    return;
  }
  req.user = payload;

  next();
};
