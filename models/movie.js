const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "Страна создания" должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "Режиссёр" должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "Длительность" должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "Год выпуска" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "Описание" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "Постер" должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "Ссылка на трейлер" должно быть заполнено'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "Постер" должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Поле "Название" должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "Название" должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
