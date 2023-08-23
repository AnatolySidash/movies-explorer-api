const signinRouter = require('express').Router();
const { login } = require('../controllers/users');

signinRouter.post('/', login);

module.exports = signinRouter;
