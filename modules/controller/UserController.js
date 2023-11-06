const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const register = async (req, res, database) => {
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
    };


const refresh = (req, res, database) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token non trovato" });
    }
  
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Refresh token non valido' });
      }
      
      const collection = database.collection('users');
  
      try {
        const result = await collection.findOne({ username: user.username });
  
        if (!result) {
          return res.status(401).json({ error: 'Utente non trovato' });
        }
  
        if (result.refreshToken !== refreshToken) {
          return res.status(401).json({ error: 'Refresh token non corrispondente' });
        }
  
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore del server' });
      }
    });
  };

  module.exports = {
    register,
    refresh,
    };
