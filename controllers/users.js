// eslint-disable-next-line linebreak-style
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/token');

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require('../utils/errors');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictRequestError = require('../errors/conflict-request-error');

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS_CODE).send(
      {
        name: user.name,
        _id: user._id,
        email: user.email,
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError(`Пользователь с таким ${email} уже существует.`));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = generateToken(payload);
      res.cookie('jwt', token, { httpOnly: true, sameSite: true });
      return res.status(OK_STATUS_CODE).send({ message: 'Авторизация прошла успешно! Доступ разрешён!' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user.payload._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user.payload._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError(`Пользователь с таким ${email} уже существует`));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.clearCookies = (req, res) => {
  res.clearCookie('jwt').status(200).send({ message: 'Cookie успешно удалены' });
};
