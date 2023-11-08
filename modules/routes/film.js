const Film = require('../models/filmModel'); 

exports.film = (app) => {
  const auth = require('../authentication');

  app.get('/film/read', async (req, res) => {
    try {
      const films = await Film.find({}); 
      res.json(films);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore nella lettura dei film' });
    }
  });

  app.post('/film/add', auth.authentication, async (req, res) => {
    const { id, title, language, director, description, purchases } = req.body;

    try {
      const newFilm = new Film({
        id,
        title,
        language,
        director,
        description,
        purchases,
      });

      await newFilm.save(); 
      res.json({ message: 'Film aggiunto' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante aggiunta del film' });
    }
  });

  app.put('/film/update/:id', auth.authentication, async (req, res) => {
    const filmId = req.params.id;
    const { title, language, director, description, purchases } = req.body;

    try {
      const updatedFilm = await Film.findByIdAndUpdate(filmId, {
        title,
        language,
        director,
        description,
        purchases,
      });

      if (!updatedFilm) {
        return res.sendStatus(404);
      }

      res.json({ message: 'Film aggiornato' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del film' });
    }
  });

  app.delete('/film/delete/:id', auth.authentication, async (req, res) => {
    const filmId = req.params.id;

    try {
      const deletedFilm = await Film.findByIdAndRemove(filmId);

      if (!deletedFilm) {
        return res.sendStatus(404);
      }

      res.json({ message: 'Film eliminato' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'eliminazione del film' });
    }
  });
};
