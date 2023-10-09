class ConflictRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'ConflictRequestError';
  }
}

module.exports = ConflictRequestError;
