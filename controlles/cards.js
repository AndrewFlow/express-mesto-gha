const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const ResourceNotFound = require('../errors/ResourceNotFound');

const {
  CREATED,
  INVALID_DATA,
  FORBIDDEN_MESSAGE,
  INVALID_ID,
} = require('../constants/constants');

const createCard = (req, res, next) => {
  // const { _id } = req.user;
  const {
    name, link,
  } = req.body;
  Card.create({
    name, link, owner: req.user._id, // заменил просто _id. убрал likes
  })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(INVALID_DATA));
      } else {
        next(err);
      }
    });
};

const getInitialCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 })
    .then((data) => res.send(data))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new ResourceNotFound(INVALID_ID);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden(FORBIDDEN_MESSAGE);
      }
      return Card.findByIdAndDelete(req.params.cardId)
        .then(() => {
          res.send(card);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(INVALID_ID));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new ResourceNotFound(INVALID_ID);
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest(INVALID_DATA));
    } else {
      next(err);
    }
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new ResourceNotFound(INVALID_ID);
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest(INVALID_DATA));
    } else {
      next(err);
    }
  });

module.exports = {
  getInitialCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
