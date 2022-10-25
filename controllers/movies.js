const Movie = require('../models/movie');
const NotFound = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  BadRequestText,
  notFoundMovieText,
  ForbiddenErrorText,
  filmDeleted,
} = require('../config/constants');

// Получить все фильмы, сохраненные пользователем.
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// Создать фильм.
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestText));
        return;
      }
      next(err);
    });
};

// Удалить фильм.
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(notFoundMovieText);
      }
      if (req.user._id.toString() !== movie.owner.toString()) {
        throw new ForbiddenError(ForbiddenErrorText);
      }
      movie.remove()
        .then(() => {
          res.send({ message: filmDeleted });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BadRequestText));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
