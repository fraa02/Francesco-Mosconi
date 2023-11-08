const auth = require('../authentication');
const filmController = require('../controller/FilmController');

exports.film = (app, database) => {
  app.get('/film/read', async (req, res) => {
    filmController.read(req, res, database);
  });

  app.post('/film/add', auth.authentication, async (req, res) => {
    filmController.add(req, res, database);
  });

  app.put('/film/update/:id', auth.authentication, async (req, res) => {
    filmController.update(req, res, database);
  });

  app.delete('/film/deleteFilm/:id',auth.authentication, async (req, res) => {
    filmController.deleteFilm(req, res, database);
  });
};