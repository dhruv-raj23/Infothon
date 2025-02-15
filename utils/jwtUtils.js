const jwt = require('jsonwebtoken');

exports.generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET, // Ensure process.env.JWT_SECRET is loaded correctly
    { expiresIn: '1h' }
  );
};