const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const ServerError = require('../errors/ServerError');
const Forbidden = require('../errors/Forbidden');

const {
  SERVER_ERROR,
  CREATED,
  INVALID_DATA,
  SERVER_ERROR_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require('../constants/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send(data))
    .catch(() => res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE }));
};

const createCard = (req, res, next) => {
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
        next(new BadRequest(INVALID_DATA));
      } next(err);
      next(new ServerError(SERVER_ERROR_MESSAGE));
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new Forbidden(FORBIDDEN_MESSAGE));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(INVALID_DATA));
      } next(err);
      next(new ServerError(SERVER_ERROR_MESSAGE));
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest(INVALID_DATA));
    } next(err);
    next(new ServerError(SERVER_ERROR_MESSAGE));
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest(INVALID_DATA));
    } next(err);
    next(new ServerError(SERVER_ERROR_MESSAGE));
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
