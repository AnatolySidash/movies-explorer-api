const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const NotAuthorizedRequestError = require('../errors/not-authorized-request-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    required: [true, 'Поле "Имя" должно быть быть заполнено'],
  },
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный Email',
    },
    required: [true, 'Поле "email" должно быть быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле "Пароль" должно быть быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorizedRequestError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthorizedRequestError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
