const Film = require('../models/filmModel');

const read = async (res) => {
  try {
    const films = await Film.find({});
    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella lettura dei film' });
  }
};

const add = async (req, res) => {
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

const update = async (req, res) => {
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
    res.status(500).json({ error: 'Errore durante l\'eliminazione del film' });
  }
};

module.exports = {
  read,
  add,
  update,
  deleteFilm,
};
