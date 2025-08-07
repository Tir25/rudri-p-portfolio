/**
 * Authentication controller
 * 
 * Handles login, registration, and user authentication
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const config = require('../config');

// Register new user (admin only)
const register = async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Conflict', message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, name, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
    }

    // Find user
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_owner: user.is_owner
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: config.security.cookieHttpOnly,
      secure: config.security.cookieSecure,
      maxAge: config.security.cookieMaxAge,
      path: '/' // Make sure cookie is available everywhere
    });
    
    // Return user info (without password) and token for clients that can't use cookies
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_owner: user.is_owner
      },
      token: token // Include token in response for non-cookie clients
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Login failed' });
  }
};

// Logout user
const logout = (req, res) => {
  try {
    // Clear token cookie with same settings as when it was set
    res.clearCookie('token', {
      httpOnly: config.security.cookieHttpOnly,
      secure: config.security.cookieSecure,
      path: '/'
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Logout failed' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // User info is already in req.user from auth middleware
    const userId = req.user.id;
    
    // Get fresh user data from database
    const query = 'SELECT id, email, name, role, is_owner FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }
    
    res.status(200).json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get profile' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};