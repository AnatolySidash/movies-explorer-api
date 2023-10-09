/* eslint-disable linebreak-style */
class NotAuthorizedRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = NotAuthorizedRequestError;
