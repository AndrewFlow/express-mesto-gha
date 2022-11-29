const router = require('express').Router();

const {
  getAllUsers, getUser, updateUser, updateAvatar, getMyInfo,
} = require('../controlles/users');

router.get('/users', getAllUsers);
router.get('/users/me', getMyInfo);
router.get('/users/:id', getUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
