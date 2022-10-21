const routerUser = require('express').Router();

const {
  getUser,
  updateProfile,
} = require('../controllers/users');

const {
  updateProfileValidation,
} = require('../middlewares/validation');

routerUser.get('/me', getUser);
routerUser.patch('/me', updateProfileValidation, updateProfile);

module.exports = routerUser;
