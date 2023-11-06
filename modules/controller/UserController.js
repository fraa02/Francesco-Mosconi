const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltrounds = 12;

const User = require('../../userModel');

const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accesso non consentito. È richiesto il ruolo di amministratore.' });
  }

  try {
    const newUser = new User({
      username: username,
      password: await bcrypt.hash(password, saltrounds),
      role: role,
    });

    const result = await newUser.save();

    res.json({ message: 'Nuovo utente registrato con successo', insertedId: result._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la registrazione dell'utente" });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token non trovato" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Refresh token non valido' });
    }

    try {
      const result = await User.findOne({ username: user.username });

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
