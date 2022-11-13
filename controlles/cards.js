const Card = require('../models/card');

const SERVER_ERROR = 'На сервере произошла ошибка';
const INVALID_ID = 'Неккоректный id';
const MISSING_CARD = 'Нет карточки с таким id';
const INVALID_DATA = 'Переданы некорректные данные';

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: SERVER_ERROR }));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const {
    name, link, likes,
  } = req.body;
  Card.create({
    name, link, likes, owner: _id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: INVALID_DATA });
        return;
      }
      res.status(500).send({ message: SERVER_ERROR });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: MISSING_CARD });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: INVALID_ID });
      } else {
        res.status(500).send({ message: SERVER_ERROR });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: MISSING_CARD });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: INVALID_ID });
    } else {
      res.status(500).send({ message: SERVER_ERROR });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: MISSING_CARD });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: INVALID_ID });
    } else {
      res.status(500).send({ message: SERVER_ERROR });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
