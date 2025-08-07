/**
 * Authentication middleware
 * 
 * Verifies JWT tokens from cookies and protects routes
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    console.log('Auth middleware - cookies received:', req.cookies);
    console.log('Auth middleware - headers:', req.headers);
    
    if (!token) {
      console.log('Auth middleware - No token found in cookies or Authorization header');
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }
    
    // Verify token
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err.message);
        return res.status(403).json({ error: 'Forbidden', message: 'Invalid or expired token' });
      }
      
      // Add user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Authentication failed' });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin' && !req.user.is_owner) {
      return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Authorization failed' });
  }
};

// Middleware to check if user is owner
const requireOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }
    
    if (!req.user.is_owner) {
      return res.status(403).json({ error: 'Forbidden', message: 'Owner access required' });
    }
    
    next();
  } catch (error) {
    console.error('Owner authorization error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Authorization failed' });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwner
};