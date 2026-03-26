const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ADMIN_ROLES, normalizeRole } = require('../utils/roles');

// Protect routes - require login
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    const normalizedRole = normalizeRole(req.user.role);
    if (req.user.role !== normalizedRole) {
      req.user.role = normalizedRole;
      await User.findByIdAndUpdate(req.user._id, { role: normalizedRole });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    const normalizedRole = normalizeRole(req.user.role);
    if (!roles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: `Role '${normalizedRole}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Check if user is any type of admin
const isAdmin = (req, res, next) => {
  const normalizedRole = normalizeRole(req.user.role);
  if (!ADMIN_ROLES.includes(normalizedRole)) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, authorize, isAdmin };
