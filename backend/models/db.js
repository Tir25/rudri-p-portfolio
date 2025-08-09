/**
 * Enhanced PostgreSQL database connection module
 * 
 * This module provides a robust connection to PostgreSQL with connection pooling,
 * error handling, and query logging for better debugging in Cursor IDE.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Create a connection pool with configuration from config or DATABASE_URL (Railway/Heroku style)
let pool;
const sslConfig = config.database.ssl ? { rejectUnauthorized: false } : false;

if (process.env.DATABASE_URL) {
  // Prefer single connection string if provided by the platform
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
    ssl: sslConfig,
  });
} else {
  // Fall back to discrete env/config variables
  pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
    ssl: sslConfig,
  });
}

// Monitor the pool events
pool.on('connect', (client) => {
  console.log('🔌 New database connection established');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client', err);
});

// Database utility functions
const db = {
  // Execute a query
  query: (text, params) => {
    console.log('🔍 Executing query:', text);
    console.log('📝 Parameters:', params);
    return pool.query(text, params);
  },

  // Execute a transaction
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Execute a SQL file
  executeFile: async (filePath) => {
    try {
      const fullPath = path.resolve(__dirname, filePath);
      console.log('📁 Reading SQL file:', fullPath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`SQL file not found: ${fullPath}`);
      }
      
      const sql = fs.readFileSync(fullPath, 'utf8');
      console.log('📄 SQL content length:', sql.length);
      
      const result = await pool.query(sql);
      console.log('✅ SQL file executed successfully');
      return result;
    } catch (error) {
      console.error('❌ Error executing SQL file:', error);
      throw error;
    }
  },

  // Check database connection
  checkConnection: async () => {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  },

  // Get pool for advanced operations
  getPool: () => pool
};

module.exports = db;