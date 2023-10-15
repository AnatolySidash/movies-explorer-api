const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

function generateToken(payload) {
  return jwt.sign({ payload }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }

  try {
    if (!jwt) {
      return false;
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('При авторизации произошла ошибка. Переданный токен некорректен');
    return false;
  }
}

module.exports = { generateToken, checkToken };
