/**
 * Database setup script for Cursor IDE
 * 
 * This script helps you set up a PostgreSQL database for the application.
 * It provides interactive prompts to configure the database connection.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');
const config = require('./config');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default values
const defaults = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'rudri_db',
  ADMIN_EMAIL: 'admin@rudri.com',
  ADMIN_PASSWORD: 'admin123'
};

// Prompt for input with default value
function prompt(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} (default: ${defaultValue}): `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Check if PostgreSQL is installed
function checkPostgresInstalled() {
  try {
    execSync('psql --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Create database
async function createDatabase(config) {
  try {
    // Test connection to PostgreSQL server
    const testPool = new Pool({
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: 'postgres' // Connect to default database
    });

    // Check if database exists
    const dbExists = await testPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [config.DB_NAME]
    );

    if (dbExists.rows.length === 0) {
      // Create database
      await testPool.query(`CREATE DATABASE ${config.DB_NAME}`);
      console.log(`Database '${config.DB_NAME}' created successfully`);
    } else {
      console.log(`Database '${config.DB_NAME}' already exists`);
    }

    await testPool.end();
    return true;
  } catch (error) {
    console.error('Error creating database:', error.message);
    return false;
  }
}

// Update .env file with database configuration
function updateEnvFile(config) {
  try {
    const envPath = '.env';
    let envContent = '';

    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add database configuration
    const envVars = {
      PORT: '4000',
      NODE_ENV: 'development',
      DB_HOST: config.DB_HOST,
      DB_PORT: config.DB_PORT,
      DB_USER: config.DB_USER,
      DB_PASSWORD: config.DB_PASSWORD,
      DB_NAME: config.DB_NAME,
      DB_SSL: 'false',
      JWT_SECRET: 'your_jwt_secret_key_change_this_in_production',
      JWT_EXPIRES_IN: '1d',
      ADMIN_EMAIL: config.ADMIN_EMAIL,
      ADMIN_PASSWORD: config.ADMIN_PASSWORD,
      CORS_ORIGIN: 'http://localhost:5173',
      MAX_FILE_SIZE: '5242880',
      UPLOAD_PATH: './uploads',
      RATE_LIMIT_WINDOW_MS: '900000',
      RATE_LIMIT_MAX_REQUESTS: '100',
      COOKIE_SECURE: 'false',
      COOKIE_HTTP_ONLY: 'true',
      COOKIE_MAX_AGE: '86400000'
    };

    // Generate .env content
    let newEnvContent = '';
    for (const [key, value] of Object.entries(envVars)) {
      // Check if key already exists in .env
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        // Replace existing value
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        // Add new key-value pair
        newEnvContent += `${key}=${value}\n`;
      }
    }

    // Write updated .env file
    fs.writeFileSync(envPath, envContent + newEnvContent);
    console.log('.env file updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔧 Database Setup for Cursor IDE');
  console.log('===============================');

  // Check if PostgreSQL is installed
  if (!checkPostgresInstalled()) {
    console.error('❌ PostgreSQL is not installed or not in PATH');
    console.log('Please install PostgreSQL and make sure psql command is available');
    process.exit(1);
  }

  console.log('✅ PostgreSQL is installed');

  // Get database configuration
  console.log('\n📝 Database Configuration:');
  const config = {
    DB_HOST: await prompt('Database host', defaults.DB_HOST),
    DB_PORT: await prompt('Database port', defaults.DB_PORT),
    DB_USER: await prompt('Database user', defaults.DB_USER),
    DB_PASSWORD: await prompt('Database password', defaults.DB_PASSWORD),
    DB_NAME: await prompt('Database name', defaults.DB_NAME),
    ADMIN_EMAIL: await prompt('Admin email', defaults.ADMIN_EMAIL),
    ADMIN_PASSWORD: await prompt('Admin password', defaults.ADMIN_PASSWORD)
  };

  // Create database
  console.log('\n🔄 Creating database...');
  const dbCreated = await createDatabase(config);
  if (!dbCreated) {
    console.error('❌ Failed to create database');
    process.exit(1);
  }

  // Update .env file
  console.log('\n🔄 Updating .env file...');
  const envUpdated = updateEnvFile(config);
  if (!envUpdated) {
    console.error('❌ Failed to update .env file');
    process.exit(1);
  }

  console.log('\n🎉 Database setup completed successfully!');
  console.log('You can now run:');
  console.log('  npm run init-db    # Initialize database schema and admin user');
  console.log('  npm run dev        # Start the development server');

  rl.close();
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { main };