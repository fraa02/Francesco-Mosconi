const auth = require('../authentication');
const filmController = require('../controller/FilmController');

exports.film = (app, database) => {
  app.get('/film/list', async (req, res) => {
    filmController.filmList(req, res, database);
  });

  app.get('/film/details/:id', async (req, res) => {
    filmController.filmDetails(req, res, database);
  });

  app.post('/film/add', auth.authentication, async (req, res) => {
    filmController.filmAdd(req, res, database);
  });

  app.put('/film/update/:id', auth.authentication, async (req, res) => {
    filmController.filmUpdate(req, res, database);
  });

  app.delete('/film/delete/:id',auth.authentication, async (req, res) => {
    filmController.deleteFilm(req, res, database);
  });
};