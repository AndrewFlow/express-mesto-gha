require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controlles/users');
const auth = require('./middlewares/auth');
const LastError = require('./errors/LastError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const routerMain = require('./routes/main');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Подключение к Mongo установлено');
});

const options = {
  origin: [
    'http://yandexpr15.nomoredomains.club',
    'https://yandexpr15.nomoredomains.club',
    'http://51.250.102.3:3000',
    'https://51.250.102.3:3000',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',

  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));
app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http:\/\/|https:\/\/)(www\.)?([a-z0-9_]+-?[/.]?)+\.[a-z]{1,7}([a-z0-9_]+-?[/.]?)+#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', routerUsers);
app.use('/', routerCards);
app.use('/', routerMain);

app.use(errorLogger);

app.use(errors());

app.use(LastError);

app.listen(PORT, () => {
  console.log(`Запустили сервер на ${PORT} порту`);
});
