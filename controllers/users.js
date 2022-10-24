const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFound = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const EmailExists = require('../errors/email-exists-err');
const EmailExistsError = require('../errors/email-exists-err');
const {
  BadRequestText,
  EmailExistsText,
  notFoundUserText,
} = require('../config/constants');

// Логин.
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// Создать пользователя.
const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestText));
        return;
      }
      if (err.code === 11000) {
        next(new EmailExists(EmailExistsText));
        return;
      }
      next(err);
    });
};

// Вернуть информацию о пользователе.
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound(notFoundUserText);
      }
      res.send(user);
    })
    .catch(next);
};

// Обновить профиль.
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((newUser) => {
      if (!newUser) {
        throw new NotFound(notFoundUserText);
      }
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestText));
        return;
      }
      if (err.code === 11000) {
        next(new EmailExistsError(EmailExistsText));
        return;
      }
      next(err);
    });
};

module.exports = {
  login,
  createUser,
  getUser,
  updateProfile,
};
