const User = require('../models/user');
const {
  serverError, emptyField, invalidField, missingUser, invalidId, invalidData,
} = require('../constants/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: serverError }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: missingUser });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: invalidId });
      } else {
        res.status(500).send({ message: serverError });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: emptyField });
          return;
        }
        if (!about) {
          res.status(400).send({ message: emptyField });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: invalidField });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: invalidField });
          return;
        }
        res
          .status(400)
          .send({ message: invalidData });
        return;
      }
      res.status(500).send({ message: serverError });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: missingUser });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        if (!name) {
          res.status(400).send({ message: emptyField });
          return;
        }
        if (!about) {
          res.status(400).send({ message: emptyField });
          return;
        }
        if (name.length < 2 || name.length > 30) {
          res.status(400).send({ message: invalidField });
          return;
        }
        if (about.length < 2 || about.length > 30) {
          res.status(400).send({ message: invalidField });
          return;
        }
        if (err.name === 'CastError') {
          res.status(400).send({ message: invalidId });
        }
        res.status(400).send({ message: invalidData });
        return;
      }
      res.status(500).send({ message: serverError });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: missingUser });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: invalidData });
        return;
      }
      res.status(500).send({ message: serverError });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
