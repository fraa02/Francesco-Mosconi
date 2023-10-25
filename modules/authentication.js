const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ error: 'Token mancante' });
    }
  
    const parts = tokenHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato del token non valido' });
    }
  
    const token = parts[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Token non valido' });
      }
      req.user = user;
      next();
    });
  };
