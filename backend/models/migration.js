/**
 * Database migration utility
 * 
 * This module provides functions to manage database migrations
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

// Migrations directory
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

/**
 * Create migrations table if it doesn't exist
 * @returns {Promise<void>}
 */
async function ensureMigrationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db.query(query);
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
}

/**
 * Get list of applied migrations
 * @returns {Promise<string[]>} - Array of migration names
 */
async function getAppliedMigrations() {
  try {
    await ensureMigrationsTable();
    
    const query = `SELECT name FROM migrations ORDER BY applied_at ASC`;
    const result = await db.query(query);
    
    return result.rows.map(row => row.name);
  } catch (error) {
    console.error('Error getting applied migrations:', error);
    throw error;
  }
}

/**
 * Get list of migration files
 * @returns {Promise<string[]>} - Array of migration file names
 */
async function getMigrationFiles() {
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically
    
    return files;
  } catch (error) {
    console.error('Error getting migration files:', error);
    throw error;
  }
}

/**
 * Apply a migration
 * @param {string} migrationName - Migration file name
 * @returns {Promise<void>}
 */
async function applyMigration(migrationName) {
  try {
    const migrationPath = path.join(MIGRATIONS_DIR, migrationName);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Use a transaction to ensure migration is atomic
    await db.transaction(async (client) => {
      // Apply migration
      await client.query(sql);
      
      // Record migration
      await client.query(
        `INSERT INTO migrations (name) VALUES ($1)`,
        [migrationName]
      );
    });
    
    console.log(`✅ Applied migration: ${migrationName}`);
  } catch (error) {
    console.error(`❌ Error applying migration ${migrationName}:`, error);
    throw error;
  }
}

/**
 * Run pending migrations
 * @returns {Promise<string[]>} - Array of applied migration names
 */
async function runMigrations() {
  try {
    const appliedMigrations = await getAppliedMigrations();
    const migrationFiles = await getMigrationFiles();
    
    const pendingMigrations = migrationFiles.filter(
      file => !appliedMigrations.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return [];
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    const appliedMigrationNames = [];
    
    for (const migration of pendingMigrations) {
      await applyMigration(migration);
      appliedMigrationNames.push(migration);
    }
    
    return appliedMigrationNames;
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

/**
 * Create a new migration file
 * @param {string} name - Migration name
 * @returns {Promise<string>} - Migration file path
 */
async function createMigration(name) {
  try {
    // Format name
    const formattedName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_');
    
    // Create timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);
    
    // Create file name
    const fileName = `${timestamp}_${formattedName}.sql`;
    const filePath = path.join(MIGRATIONS_DIR, fileName);
    
    // Create file with template
    const template = `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- Write your SQL migration here

-- Example:
-- CREATE TABLE example (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
`;
    
    fs.writeFileSync(filePath, template);
    console.log(`✅ Created migration: ${fileName}`);
    
    return filePath;
  } catch (error) {
    console.error('Error creating migration:', error);
    throw error;
  }
}

module.exports = {
  ensureMigrationsTable,
  getAppliedMigrations,
  getMigrationFiles,
  applyMigration,
  runMigrations,
  createMigration
};