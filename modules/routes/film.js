const auth = require('../authentication');
const filmController = require('../controller/FilmController');

exports.film = (app, database) => {
  app.get('/film/read', async (req, res) => {
    filmController.login(req, res, database);
  });

  app.post('/film/add', auth.authentication, async (req, res) => {
    filmController.logout(req, res, database);
  });

  app.put('/film/update/:id', auth.authentication, async (req, res) => {
    filmController.refresh(req, res, database);
  });

  app.delete('/film/deleteFilm/:id',auth.authentication, async (req, res) => {
    filmController.view(req, res, database);
  });
};