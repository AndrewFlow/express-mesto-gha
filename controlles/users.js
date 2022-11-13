const User = require('../models/user');

const {
  SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  INVALID_ID,
  INVALID_DATA,
  MISSING_USER,
  EMPTY_FIELD,
  INVALID_FIELD,
  SERVER_ERROR_MESSAGE,
} = require('../constants/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_USER });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
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
        res
          .status(BAD_REQUEST)
          .send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_USER });
      }
      return res.send(user);
    })
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
    .then((user) => {
      if (!user) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_USER });
      }
      return res.send(user);
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

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
