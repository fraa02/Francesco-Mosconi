  const auth = require('../authentication');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');

exports.users = (app, client, database) => {
  app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
    const collection = database.collection('users');
    const user = await collection.find({"username": req.body.username}).toArray();
    try {

      if (username && await bcrypt.compare(password, user[0].password)) {
        const userForToken = {
          username: user[0].username,
          role: user[0].role,
        };
        console.log(userForToken);
        const accessToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' });
  
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
  
        res.json({ accessToken });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore durante login" });

    }
  });

  app.post('/users/register', async (req, res) => {

      const { username, password, role } = req.body;

      const newUser = {
        username: username,
        password: await bcrypt.hash(password, 10),
        role: role,
      };

      try {
        const collection = database.collection('users');
        const result = await collection.insertOne(newUser);

        res.json({ message: 'Nuovo utente registrato con successo', insertedId: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore durante la registrazione dell'utente" });
      }
    });

  app.put('/users/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token non trovato" });
    }
  
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      if (Date.now() >= payload.exp * 1000) {
        return res.status(401).json({ error: "Refresh token scaduto" });
      }
      const accessToken = generateAccessToken(payload);
      res.json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Refresh token non valido" });
    }
  });

  app.delete('/users/logout', async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: "Refresh token revocato con successo" });
    }
  )};
