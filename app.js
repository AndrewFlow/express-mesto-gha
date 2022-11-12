const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerMain = require('./routes/main');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Подключение к Mongo установлено');
});

app.use((req, res, next) => {
  req.user = {
    _id: '636e29b8972b9032053e4903',
  };
  next();
});

const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routerMain);
app.use('/', routerUsers);
app.use('/', routerCards);

app.listen(PORT, () => {
  console.log(`Запустили сервер на  ${PORT} порту`);
});
