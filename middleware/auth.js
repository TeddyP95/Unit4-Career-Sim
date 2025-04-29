const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'nevertellanyone' } = process.env;

const authRequired = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'Authorization required',
      message: 'You must be logged in to perform this action'
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token',
      message: 'Your session has expired or is invalid'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'You must be an administrator to perform this action'
    });
  }
  next();
};

module.exports = {
  authRequired,
  isAdmin
}; 