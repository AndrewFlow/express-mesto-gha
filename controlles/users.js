const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const ResourceNotFound = require('../errors/ResourceNotFound');
const ServerError = require('../errors/ServerError');

const {
  SERVER_ERROR,
  BAD_REQUEST,
  CREATED,
  INVALID_ID,
  INVALID_DATA,
  SERVER_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
} = require('../constants/constants');
const Duplicate = require('../errors/Duplicate');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        return next(new ResourceNotFound(RESOURCE_NOT_FOUND_MESSAGE));
      } return res.send(user);
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

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user == null) {
        next(new ResourceNotFound(INVALID_DATA));
      }
      res.send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
const createUser = (req, res, next) => {
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
        next(new BadRequest(INVALID_DATA));
      }
      if (err.code === 11000) {
        next(new Duplicate('Имейл уже зарегестрирован'));
      }
      if (err.name === 'ServerError') {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user === null) {
        throw new Unauthorized(INVALID_DATA);
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized(INVALID_DATA);
          } const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 604800,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ token });
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(INVALID_DATA));
      }
      if (err.name === 'ServerError') {
        next(new ServerError(SERVER_ERROR_MESSAGE));
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(INVALID_DATA));
      } next(err);
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
