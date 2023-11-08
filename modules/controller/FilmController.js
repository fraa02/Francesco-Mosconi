const Film = require('../models/filmModel');

const filmList = async (req,res) => {
  try {
    const films = await Film.find({}, 'title'); 
    const titles = films.map(film => film.title); 
    res.json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella lettura dei film' });
  }
};

const filmDetails = async (req, res) => {
  const filmId = req.params.id;

  try {
    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ error: 'Film non trovato' });
    }
    res.json(film);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella lettura dei dettagli del film' });
  }
};

const filmAdd = async (req, res) => {
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
    res.status(500).json({ error: 'Errore durante l\'aggiunta del film' });
  }
};

const filmUpdate = async (req, res) => {
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
};

const deleteFilm = async (req, res) => {
  const filmId = req.params.id;

  try {
    const deletedFilm = await Film.findByIdAndRemove(filmId);

    if (!deletedFilm) {
      return res.sendStatus(404);
    }

    res.json({ message: 'Film eliminato' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante eliminazione del film' });
  }
};

module.exports = {
  filmList,
  filmDetails,
  filmAdd,
  filmUpdate,
  deleteFilm,
};
