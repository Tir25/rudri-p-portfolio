/**
 * Database migration script
 * 
 * This script manages database migrations
 * Run with: node migrate.js [command] [args]
 * 
 * Commands:
 *   up        - Run all pending migrations
 *   create    - Create a new migration file
 *   status    - Show migration status
 * 
 * Examples:
 *   node migrate.js up
 *   node migrate.js create add_user_profile
 *   node migrate.js status
 */

require('dotenv').config();
const migration = require('./models/migration');
const db = require('./models/db');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const commandArg = args[1];

// Main function
async function main() {
  try {
    // Check database connection
    const connected = await db.checkConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Run command
    switch (command) {
      case 'up':
        await runMigrationsUp();
        break;
      case 'create':
        await createMigration(commandArg);
        break;
      case 'status':
        await showMigrationStatus();
        break;
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run migrations up
async function runMigrationsUp() {
  console.log('🔄 Running migrations...');
  
  const appliedMigrations = await migration.runMigrations();
  
  if (appliedMigrations.length === 0) {
    console.log('✅ No migrations to apply');
  } else {
    console.log(`✅ Applied ${appliedMigrations.length} migrations`);
  }
}

// Create a new migration
async function createMigration(name) {
  if (!name) {
    console.error('❌ Migration name is required');
    console.log('Example: node migrate.js create add_user_profile');
    process.exit(1);
  }
  
  console.log(`🔄 Creating migration: ${name}`);
  
  const filePath = await migration.createMigration(name);
  console.log(`✅ Migration file created: ${filePath}`);
}

// Show migration status
async function showMigrationStatus() {
  console.log('🔄 Checking migration status...');
  
  const appliedMigrations = await migration.getAppliedMigrations();
  const migrationFiles = await migration.getMigrationFiles();
  
  const pendingMigrations = migrationFiles.filter(
    file => !appliedMigrations.includes(file)
  );
  
  console.log('\n📊 Migration Status:');
  console.log(`- Applied migrations: ${appliedMigrations.length}`);
  console.log(`- Pending migrations: ${pendingMigrations.length}`);
  
  if (appliedMigrations.length > 0) {
    console.log('\n✅ Applied Migrations:');
    appliedMigrations.forEach(migration => {
      console.log(`- ${migration}`);
    });
  }
  
  if (pendingMigrations.length > 0) {
    console.log('\n⏳ Pending Migrations:');
    pendingMigrations.forEach(migration => {
      console.log(`- ${migration}`);
    });
  }
}

// Show help
function showHelp() {
  console.log(`
Database Migration Tool

Usage: node migrate.js [command] [args]

Commands:
  up        - Run all pending migrations
  create    - Create a new migration file
  status    - Show migration status

Examples:
  node migrate.js up
  node migrate.js create add_user_profile
  node migrate.js status
  `);
}

// Run main function
main();