const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (user) => {
const userForToken = {
  username: user.username,
  role: user.role,
};
return jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const login = async (req, res, database) => {
const { username, password } = req.body;
const collection = database.collection('users');
const user = await collection.findOne({ username: username });

try {
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

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

const logout = async (req, res, database) => {
const userId = req.user.userId;
const refreshToken = req.cookies.refreshToken;

if (!userId || !refreshToken) {
  return res.status(400).json({ error: "ID utente o Refresh token mancante" });
}

try {
  const collection = database.collection('users');
  const result = await collection.updateOne(
    { _id: userId },
    { $pull: { refreshToken: refreshToken } }
  );

  if (result.modifiedCount > 0) {
    res.clearCookie('refreshToken');
    res.json({ message: "Refresh token revocato con successo" });
  } else {
    res.status(400).json({ error: "Token di refresh non trovato per questo utente" });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Errore durante la revoca del token di refresh" });
}
};

module.exports = {
login,
logout,
};
