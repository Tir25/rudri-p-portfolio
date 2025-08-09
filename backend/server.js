/**
 * Main server file for the backend API
 * Simplified and stable configuration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const paperRoutes = require('./routes/papers');

// Import database utilities
const db = require('./models/db');

const app = express();
const PORT = config.port;

// Production HTTPS configuration
let httpsOptions = null;
if (config.nodeEnv === 'production' && config.production.enableHttps) {
  try {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private.key'),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/certificate.crt')
    };
    console.log('🔒 HTTPS configuration loaded');
  } catch (error) {
    console.warn('⚠️ HTTPS certificates not found, running in HTTP mode');
  }
}

// Basic security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration with production domain support
const corsOrigins = [
  config.cors.origin,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// Add production domain if specified
if (process.env.PRODUCTION_DOMAIN) {
  corsOrigins.push(`https://${process.env.PRODUCTION_DOMAIN}`);
  corsOrigins.push(`https://www.${process.env.PRODUCTION_DOMAIN}`);
}

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbConnected = await db.checkConnection();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbConnected ? 'connected' : 'disconnected',
      environment: config.nodeEnv,
      https: config.nodeEnv === 'production' && config.production.enableHttps
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/papers', paperRoutes);

// Serve static files (for uploaded images) with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads'), { fallthrough: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Don't leak error details in production
  const errorMessage = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: errorMessage,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connection
    const pool = db.getPool ? db.getPool() : db.pool;
    pool.end(() => {
      console.log('✅ Database connection closed');
      console.log('👋 Server shutdown complete');
      process.exit(0);
    });
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Process event handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start server
let server;
if (httpsOptions && config.nodeEnv === 'production') {
  // HTTPS server for production
  server = https.createServer(httpsOptions, app).listen(PORT, async () => {
    try {
      const dbConnected = await db.checkConnection();
      
      console.log('🚀 HTTPS Server starting...');
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔒 HTTPS Server running on port ${PORT}`);
      console.log(`📊 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`🔗 Health check: https://localhost:${PORT}/health`);
      console.log(`📚 API docs: https://localhost:${PORT}/api`);
      console.log('✨ Server is ready to handle requests!');
      
      // Log server info
      console.log('\n📋 Server Information:');
      console.log(`   Node.js version: ${process.version}`);
      console.log(`   Platform: ${process.platform}`);
      console.log(`   Architecture: ${process.arch}`);
      console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      
      console.log('\n🔒 Production Mode Active:');
      console.log(`   HTTPS: ${config.production.enableHttps ? 'Enabled' : 'Disabled'}`);
      console.log(`   Compression: ${config.production.enableCompression ? 'Enabled' : 'Disabled'}`);
      console.log(`   Monitoring: ${config.production.enableMonitoring ? 'Enabled' : 'Disabled'}`);
      console.log(`   Secure Cookies: ${config.security.cookieSecure ? 'Enabled' : 'Disabled'}`);
      
    } catch (error) {
      console.error('❌ Failed to start HTTPS server:', error);
      process.exit(1);
    }
  });
} else {
  // HTTP server for development
  server = app.listen(PORT, async () => {
    try {
      const dbConnected = await db.checkConnection();
      
      console.log('🚀 Server starting...');
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📊 Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
      console.log('✨ Server is ready to handle requests!');
      
      // Log server info
      console.log('\n📋 Server Information:');
      console.log(`   Node.js version: ${process.version}`);
      console.log(`   Platform: ${process.platform}`);
      console.log(`   Architecture: ${process.arch}`);
      console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      
      // Production specific logs
      if (config.nodeEnv === 'production') {
        console.log('\n🔒 Production Mode Active:');
        console.log(`   HTTPS: ${config.production.enableHttps ? 'Enabled' : 'Disabled'}`);
        console.log(`   Compression: ${config.production.enableCompression ? 'Enabled' : 'Disabled'}`);
        console.log(`   Monitoring: ${config.production.enableMonitoring ? 'Enabled' : 'Disabled'}`);
        console.log(`   Secure Cookies: ${config.security.cookieSecure ? 'Enabled' : 'Disabled'}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  });
}

// Keep server alive
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

module.exports = app;