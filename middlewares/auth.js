/* eslint-disable linebreak-style */
const { checkToken } = require('../utils/token');
const NotAuthorizedRequestError = require('../errors/not-authorized-request-error');

const auth = (req, res, next) => {
  if (!req.cookies) {
    next(new NotAuthorizedRequestError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
    return;
  }

  const token = req.cookies.jwt;

  const payload = checkToken(token);

  if (!payload) {
    next(new NotAuthorizedRequestError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
