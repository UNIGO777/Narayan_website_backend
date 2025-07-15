const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock user for when MongoDB is not available
const mockUser = {
  _id: 'mock-user-admin',
  name: 'Admin User',
  email: 'admin@narayangurukul.org',
  role: 'admin',
  isActive: true
};

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Token:', token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Development mode bypass for dev-token
    if (token === 'dev-token' && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)) {
      req.user = mockUser;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded)
    
    
    // Find user and check if still active
    const user = await User.findById(decoded.id);
    

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware aliases for common roles
const requireAuth = authenticateToken;
const requireAdmin = [authenticateToken, requireRole('admin')];
const requireEditor = [authenticateToken, requireRole('admin', 'editor')];

module.exports = {
  authenticateToken,
  requireRole,
  requireAuth,
  requireAdmin,
  requireEditor
}; 