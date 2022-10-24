require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const { DATABASE } = require('./config/database');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rate-limiter');
const { errorHandler } = require('./middlewares/error-handler');

const { PORT = 3000, MONGO_DATABASE = DATABASE } = process.env;
mongoose.connect(MONGO_DATABASE, {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
