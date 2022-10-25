const routerMovie = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  movieValidation,
  movieIdValidation,
} = require('../middlewares/validation');

routerMovie.get('/', getMovies);
routerMovie.post('/', movieValidation, createMovie);
routerMovie.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = routerMovie;
