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

  app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await getUserByUsername(username);

      if (user && await bcrypt.compare(password, user.password)) {
        const userForToken = {
          email: user.email,
          role: user.role,
        };

        const accessToken = generateAccessToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

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
  });

  app.post('/users/logout', async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: "Refresh token revocato con successo" });
  });

  app.post('/users/refresh', async (req, res) => {
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
}
