const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  loginValidation,
  userValidation,
} = require('../middlewares/validation');
const { notFoundURLText } = require('../config/constants');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);
router.use(auth, (req, res, next) => {
  next(new NotFoundError(notFoundURLText));
});

module.exports = router;
