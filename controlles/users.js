const User = require('../models/user');

const SERVER_ERROR = 'На сервере произошла ошибка';
const INVALID_ID = 'Неккоректный id';
const INVALID_DATA = 'Переданы некорректные данные';
const MISSING_USER = 'Запрашиваемый пользователь не найден';
const EMPTY_FIELD = 'Поле не должно быть пустым!';
const INVALID_FIELD = 'Переданы некорректные данные .Значениe должно не менее 2 и не более 30 символов';

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: SERVER_ERROR }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: MISSING_USER });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: INVALID_ID });
      } else {
        res.status(500).send({ message: SERVER_ERROR });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: EMPTY_FIELD });
          return;
        }
        if (!about) {
          res.status(400).send({ message: EMPTY_FIELD });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: INVALID_FIELD });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: INVALID_FIELD });
          return;
        }
        res
          .status(400)
          .send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: INVALID_ID });
        return;
      }
      res.status(500).send({ message: SERVER_ERROR });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: MISSING_USER });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: EMPTY_FIELD });
          return;
        }
        if (!about) {
          res.status(400).send({ message: EMPTY_FIELD });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: INVALID_FIELD });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: INVALID_FIELD });
          return;
        }
        res.status(400).send({ message: INVALID_DATA });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: INVALID_ID });
        return;
      }
      res.status(500).send({ message: SERVER_ERROR });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: MISSING_USER });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: INVALID_DATA });
        return;
      }
      res.status(500).send({ message: SERVER_ERROR });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
