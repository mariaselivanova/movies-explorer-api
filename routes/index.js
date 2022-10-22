const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  loginValidation,
  userValidation,
} = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', loginValidation, login);
router.post('/signup', userValidation, createUser);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница с таким url не найдена'));
});

module.exports = router;
