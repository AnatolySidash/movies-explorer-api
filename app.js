const express = require('express');
const bodyParser = require('body-parser');
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`)
})