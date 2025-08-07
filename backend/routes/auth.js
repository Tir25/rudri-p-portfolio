/**
 * Authentication routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.post('/register', authenticateToken, requireAdmin, authController.register);
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;