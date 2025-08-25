const jwt = require('jsonwebtoken');
const { generateResponse } = require('../utils/responseHelper');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json(generateResponse(
      false,
      'Access token is required'
    ));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json(generateResponse(
          false,
          'Token expired'
        ));
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(generateResponse(
          false,
          'Invalid token'
        ));
      }
      return res.status(403).json(generateResponse(
        false,
        'Token verification failed'
      ));
    }

    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(generateResponse(
        false,
        'Authentication required'
      ));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(generateResponse(
        false,
        'Insufficient permissions'
      ));
    }

    next();
  };
};

// Permission-based authorization middleware
const authorizePermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(generateResponse(
        false,
        'Authentication required'
      ));
    }

    // In a real application, you would fetch user permissions from database
    // For demo, we'll use a simple role-to-permission mapping
    const rolePermissions = {
      'Administrator': ['dashboard', 'projects', 'resources', 'reports', 'users', 'settings'],
      'Project Manager': ['dashboard', 'projects', 'resources', 'reports'],
      'HR Manager': ['dashboard', 'resources', 'reports', 'employees'],
      'Chief Executive Officer': ['dashboard', 'projects', 'resources', 'reports', 'analytics', 'finance'],
      'Finance Manager': ['dashboard', 'finance', 'reports', 'billing']
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    const hasPermission = permissions.some(permission => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json(generateResponse(
        false,
        'Insufficient permissions'
      ));
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizePermissions
};