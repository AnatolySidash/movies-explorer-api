const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUserInfo } = require('../controllers/users');

userRouter.get('/me', getCurrentUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = userRouter;
