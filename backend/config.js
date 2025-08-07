/**
 * Configuration file for the backend
 * Loads environment variables with proper defaults
 */

require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'rudri_db',
    ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  
  // Admin User Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'rudridave1998@gmail.com',
    password: process.env.ADMIN_PASSWORD || '19111998'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Security Configuration
  security: {
    cookieSecure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
    cookieHttpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
    cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000 // 1 day
  },

  // Production Settings
  production: {
    enableHttps: process.env.NODE_ENV === 'production',
    enableCompression: process.env.NODE_ENV === 'production',
    enableLogging: process.env.NODE_ENV === 'production',
    enableMonitoring: process.env.NODE_ENV === 'production'
  }
};

module.exports = config;
