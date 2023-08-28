const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require('../utils/errors');

const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res
      .status(OK_STATUS_CODE).send(movie))
    .catch((err) => {
      next(err);
    });
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user.payload._id,
  })
    .then((movie) => res
      .status(CREATED_STATUS_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для добавления фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Кинокартина по указанному id не найдена.');
      }
      if (String(movie.owner) === String(req.user.payload._id)) {
        Movie.deleteOne(movie).then(() => res
          .status(OK_STATUS_CODE).send(movie))
          .catch((err) => {
            next(err);
          });
      }
      if (String(movie.owner) !== String(req.user.payload._id)) {
        throw new ForbiddenError('Доступ запрещён');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные фильма'));
      } else {
        next(err);
      }
    });
};
