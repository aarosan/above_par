const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware for token validation with logging
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    
    req.userId = user.userId; // Set req.userId from token payload
    next();
  });
};

module.exports = authenticateToken;