const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: `Упс!Произошла ошибка ${err}` }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверно указан id' });
      } else {
        res.status(500).send({ message: 'Упс!На сервере произошла ошибка!' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: 'Поле Name не должно быть пустым!' });
          return;
        }
        if (!about) {
          res.status(400).send({ message: 'Поле About не должно быть пустым!' });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: 'Переданы невалидные данные поля Name.Значениe должно не менее 2 символов и не более 30' });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: 'Переданы невалидные данные поля About.Значениe должно не менее 2 символов и не более 30' });
          return;
        }
        res
          .status(400)
          .send({ message: `Переданы неккоректные данные. ${err.message}` });
        return;
      }
      res.status(500).send({ message: 'Упс!На сервере произошла ошибка!' });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: 'Поле Name не должно быть пустым!' });
          return;
        }
        if (!about) {
          res.status(400).send({ message: 'Поле About не должно быть пустым!' });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: 'Переданы невалидные данные поля Name.Значениe должно не менее 2 символов и не более 30' });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: 'Переданы невалидные данные поля About.Значениe должно не менее 2 символов и не более 30' });
          return;
        }
        res.status(400).send({ message: `Переданы неккоректные данные ${err.message}` });
        return;
      }
      res.status(500).send({ message: 'Упс!На сервере произошла ошибка!' });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'Упс!На сервере произошла ошибка!' });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
