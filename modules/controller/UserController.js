const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const view = (req, res) => {
  const userInfo = {
    username: req.user.username,
    role: req.user.role,
  };
  res.json(userInfo);
};

const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accesso non consentito. È richiesto il ruolo di amministratore.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      role: role,
    });

    const result = await newUser.save();

    res.json({ message: 'Nuovo utente registrato con successo', insertedId: result._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la registrazione dell'utente" });
  }
};

const modify = async (req, res) => {
  const userId = req.params.id;
  const { newPassword, newInfo } = req.body;

  if (!req.user || !req.user.role) {
    return res.status(401).json({ error: 'Accesso non consentito' });
  }

  const requesterRole = req.user.role;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    if (requesterRole === 'admin') {
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10); 
      }
      if (newInfo) {
        user.username = newInfo.username;
        user.role = newInfo.role;
      }
    } else {
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10); 
      }
    }

    const result = await user.save();
    res.json({ message: 'Informazioni utente modificate con successo', updatedUser: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la modifica delle informazioni utente' });
  }
};

module.exports = {
  view,
  register,
  modify,
};
