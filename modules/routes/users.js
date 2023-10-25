exports.users = (app, client, database) => {
  const auth = require('../auth');

  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');

  app.post('/users/login', async (req, res) => {

    const authenticate = await auth.authenticate(client, database, req);
    
    if (authenticate === "admin") {
    const { username, password } = req.body;
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && await bcrypt.compare(password, user.password)) {
        const userForToken = {
          email: user.email,
          role: user.role,
        };
  
        const accessToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' });
  
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
  
        res.json({ accessToken });
      } else {
        res.status(401).json({ error: 'Username o password non valide' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore durante login" });
    }
  }
  });

  app.post('/users/register', async (req, res) => {
    const authenticate = await auth.authenticate(client, database, req);

    if (authenticate === "admin") {
      const { username, password, email, role } = req.body;

      const newUser = {
        username: username,
        password: await bcrypt.hash(password, 10),
        email: email,
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
    } else {
      res.status(401).json({ error: 'Utente non autorizzato a registrare nuovi utenti' });
    }
  });

  app.put('/users/refresh', async (req, res) => {
    const authenticate = await auth.authenticate(client, database, req);
    
    if (authenticate === "admin") {
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
  }
  });

  app.delete('/users/logout', async (req, res) => {
    const authenticate = await auth.authenticate(client, database, req);
    
    if (authenticate === "admin") {
    res.clearCookie('refreshToken');
    res.json({ message: "Refresh token revocato con successo" });
    }
  });
}
