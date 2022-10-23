const Movie = require('../models/movie');
const NotFound = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

// Получить все фильмы, сохраненные пользователем.
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      if (movies.length === 0) {
        res.send('Ничего не найдено');
      }
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
        next(new BadRequest('Неверный запрос'));
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
        throw new NotFound('Фильм не найден');
      }
      if (req.user._id.toString() !== movie.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }

      return Movie.findByIdAndDelete(req.params.moviedId)
        .then(() => {
          res.send({ message: 'Фильм успешно удален' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный запрос'));
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
