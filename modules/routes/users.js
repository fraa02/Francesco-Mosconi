exports.users = (app, client, database) => {
  console.log("entrato in users");
  const auth = require('../auth');

  const { MongoClient } = require('mongodb');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
}
  
  app.post('/users/add', async (req, res) => {
    const authenticate = await auth.auth(client, database, req);

    if (authenticate === "admin") {
      try {
        const saltRounds = 10;
        const PasswordBase = req.body.password;
        const hashedPassword = await bcrypt.hash(PasswordBase, saltRounds);

        const newUser = {
          email: req.body.email,
          password: hashedPassword,
          role: req.body.role,
          usage: {
            latestRequestDate: new Date().toLocaleDateString(),
            numberOfRequests: 1,
          },
        };

        const collection = database.collection('users');
        const result = await collection.insertOne(newUser);

        const userForToken = {
          email: newUser.email,
          role: newUser.role,
        };

        const accessToken = generateAccessToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true });
        await client.connect();
        const db = client.db('users');
        const tokensCollection = db.collection('tokens');
        await tokensCollection.insertOne({ refreshToken });
        await client.close();

        res.send({ message: "Registrato", user: newUser, accessToken, refreshToken });

      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Errore durante la registrazione" });
      }
    } else {
      res.status(403).send({ error: "Accesso non autorizzato" });
    }
  });

  app.post('/users/logout', async (req, res) => {
    const { refreshToken } = req.body;
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true });
    await client.connect();
    const db = client.db('users');
    const tokensCollection = db.collection('tokens');
    await tokensCollection.insertOne({ refreshToken });
    await client.close();
    res.send({ message: "Refresh token revocato con successo" });
  });

  app.post('/users/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const accessToken = generateAccessToken(payload);
      res.send({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(401).send({ error: "Refresh token non valido" });
    }
  });
}