const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUser, updateUser, updateAvatar, getMyInfo,
} = require('../controlles/users');

router.get('/users', getAllUsers);
router.get('/users/me', getMyInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(http:\/\/|https:\/\/)(www\.)?([a-z0-9_]+-?[/.]?)+\.[a-z]{1,7}([a-z0-9_]+-?[/.]?)+#?$/),
  }),
}), updateAvatar);

module.exports = router;
