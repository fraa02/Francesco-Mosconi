const jwt = require('jsonwebtoken');

exports.authentication = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Token non valido' });
    }
    req.user = user;
    next();
  });
};

exports.expiredToken = (req, res) => {
  return res.status(401).json({ error: 'Token scaduto' });
};
