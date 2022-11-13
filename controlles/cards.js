const Card = require('../models/card');

const {
  SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  CREATED,
  INVALID_ID,
  INVALID_DATA,
  SERVER_ERROR_MESSAGE,
  MISSING_CARD,
} = require('../constants/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const {
    name, link, likes,
  } = req.body;
  Card.create({
    name, link, likes, owner: _id,
  })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: INVALID_DATA });
        return;
      }
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_CARD });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: INVALID_ID });
      } else {
        res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
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
      return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_CARD });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: INVALID_ID });
    } else {
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(RESOURCE_NOT_FOUND).send({ message: MISSING_CARD });
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: INVALID_ID });
    } else {
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
