const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { invalidPasswordOrEmailText } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(invalidPasswordOrEmailText));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(invalidPasswordOrEmailText));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
