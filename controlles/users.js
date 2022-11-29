const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  SERVER_ERROR,
  BAD_REQUEST,
  CREATED,
  INVALID_ID,
  INVALID_DATA,
  EMPTY_FIELD,
  INVALID_FIELD,
  SERVER_ERROR_MESSAGE,
  UNAUTHORIZED,
} = require('../constants/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

const getMyInfo = (req, res) => {
  User.findById(req.user._id).orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id).orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    return res.status(BAD_REQUEST).send({ message: INVALID_DATA });
  }
  bcrypt.hash(password, 10).then((hash) => User.create({
    name: name || undefined,
    about: about || undefined,
    avatar: avatar || undefined,
    email,
    password: hash,
  }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(BAD_REQUEST).send({ message: EMPTY_FIELD });
          return;
        }
        if (!about) {
          res.status(BAD_REQUEST).send({ message: EMPTY_FIELD });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(BAD_REQUEST).send({ message: INVALID_FIELD });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(BAD_REQUEST).send({ message: INVALID_FIELD });
          return;
        }
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED)
        .send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(BAD_REQUEST).send({ message: EMPTY_FIELD });
          return;
        }
        if (!about) {
          res.status(BAD_REQUEST).send({ message: EMPTY_FIELD });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(BAD_REQUEST).send({ message: INVALID_FIELD });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(BAD_REQUEST).send({ message: INVALID_FIELD });
          return;
        }
        res.status(BAD_REQUEST).send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  getMyInfo,
  login,
};
