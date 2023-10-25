exports.film = (app, client, database) => {
  const auth = require('../auth');
  
  app.get('/film/read', async (req, res) => {
    const authenticate = await auth.auth(client, database, req);
    if (authenticate === "user" || authenticate ==="admin") {
        const collection = database.collection('film');

        const result = await collection.find({"id": (req.params.id)}).toArray();
        res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
  
  app.post('/film/add', async (req, res) => {
    const authenticate = await auth.authentication(client, database, req);
    if (authenticate === "admin") {
    try {
      const collection = database.collection('film');
      const result = await collection.insertOne(
        {
          id: req.body.id,
          title: req.body.title,
          language: req.body.language,
          director: req.body.director,
          description: req.body.description,
          purchases: req.body.purchases});
      
      res.send({ message: "Film aggiunto" });

    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
    }else {
    res.sendStatus(401);
    }
  });
  
  app.put('/film/update/:id', async (req, res) => {
    const authenticate = await auth.authentication(client, database, req);
    if (authenticate === "admin") {
      try {
        const collection = database.collection('film');
        const result = await collection.updateOne({ 'id': req.params.isbn },{$set:{
          'title': req.body.title,
          'language': req.body.language,
          'director': req.body.director,
          'description': req.body.description,
          'purchases': req.body.purchases}});
          
          res.send({ message: "Film aggiornato" });
      }
      catch (error) {
        console.log(error);
        res.sendStatus(400);
      }
    }
    else {
      res.sendStatus(401);
    }
  });  
}

app.delete('/film/delete/:id', async (req, res) => {
  const authenticate = await auth.authentication(client, database, req);
  if (authenticate === "admin") {
    try {
      const collection = database.collection('film');
      const result = await collection.updateOne(
        { id: req.params.id },
        { $pull: { id: req.params.id } }
      );
      if (result.modifiedCount === 1) {
        res.send({ message: "Film eliminato" });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Errore" });
    }
  } else {
    res.sendStatus(401);
  }
});