const signupRouter = require('express').Router();
const { createUser } = require('../controllers/users');

signupRouter.post('/', createUser);

module.exports = signupRouter;
