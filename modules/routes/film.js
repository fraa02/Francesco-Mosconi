exports.film = (app, client, database) => {
  const auth = require('../authentication');

  app.get('/film/read', auth.authentication, async (req, res) => {
    const collection = database.collection('film');

    const result = await collection.find({ id: req.params.id }).toArray();
    if (result.length > 0) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
  });

  app.post('/film/add', auth.authentication, async (req, res) => {
    try {
      const collection = database.collection('film');
      const result = await collection.insertOne({
        id: req.body.id,
        title: req.body.title,
        language: req.body.language,
        director: req.body.director,
        description: req.body.description,
        purchases: req.body.purchases,
      });

      res.send({ message: "Film aggiunto" });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

  app.put('/film/update/:id', auth.authentication, async (req, res) => {
    try {
      const collection = database.collection('film');
      const result = await collection.updateOne({ id: req.params.id }, {
        $set: {
          title: req.body.title,
          language: req.body.language,
          director: req.body.director,
          description: req.body.description,
          purchases: req.body.purchases,
        },
      });

      if (result.modifiedCount === 1) {
        res.send({ message: "Film aggiornato" });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

  app.delete('/film/delete/:id', auth.authentication, async (req, res) => {
    try {
      const collection = database.collection('film');
      const result = await collection.deleteOne({ id: req.params.id });

      if (result.deletedCount === 1) {
        res.send({ message: "Film eliminato" });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Errore" });
    }
  });
};
