const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const generateAccessToken = (user) => {
  const userForToken = {
    username: user.username,
    role: user.role,
  };
  return jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      user.refreshTokens.push(refreshToken);
      await user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

const logout = async (req, res) => {
  const username = req.user.username;
  const refreshToken = req.cookies.refreshToken;

  if (!username || !refreshToken) {
    return res.status(400).json({ error: 'Nome utente o Refresh token mancante' });
  }

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ error: 'Utente non trovato' });
    }

    const tokenIndex = user.refreshTokens.indexOf(refreshToken);

    if (tokenIndex !== -1) {
      user.refreshTokens.splice(tokenIndex, 1); 
      await user.save(); 

      res.clearCookie('refreshToken');
      res.json({ message: 'Refresh token revocato con successo' });
    } else {
      res.status(400).json({ error: 'Token di refresh non trovato per questo utente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la revoca del token di refresh' });
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
}
module.exports = {
  login,
  logout,
  refresh,
};
