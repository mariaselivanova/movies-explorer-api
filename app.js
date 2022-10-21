/* eslint-disable import/newline-after-import */
require('dotenv').config();
const express = require('express');
const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerMovie = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const {
  loginValidation,
  userValidation,
} = require('./middlewares/validation');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);
app.use(auth);
app.use('/users', routerUser);
app.use('/cards', routerMovie);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница с таким url не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
