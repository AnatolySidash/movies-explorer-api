const signoutRouter = require('express').Router();
const { clearCookies } = require('../controllers/users');

signoutRouter.post('/', clearCookies);

module.exports = signoutRouter;
