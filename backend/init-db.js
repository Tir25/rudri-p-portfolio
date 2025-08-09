/**
 * Database initialization script
 * 
 * This script sets up the database schema and initial data
 */

const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./models/db');
const config = require('./config');

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Read and execute schema
    console.log('📋 Creating database schema...');
    // Execute schema using absolute path relative to this file's directory
    await db.executeFile(path.join('..', 'models', 'schema.sql'));
    console.log('✅ Schema created successfully');
    
    // Check if admin user exists
    console.log('👤 Checking for admin user...');
    const adminCheck = await db.query('SELECT * FROM users WHERE email = $1', [config.admin.email]);
    
    if (adminCheck.rows.length === 0) {
      console.log('👤 Creating default admin user...');
      
      // Hash password for admin user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(config.admin.password, saltRounds);
      
      // Create admin user
      await db.query(`
        INSERT INTO users (email, password, name, role, is_owner)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        config.admin.email,
        hashedPassword,
        'Rudri Dave',
        'admin',
        true
      ]);
      
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${config.admin.email}`);
      console.log(`🔑 Password: ${config.admin.password}`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Insert default settings if they don't exist
    console.log('⚙️ Setting up default settings...');
    await db.query(`
      INSERT INTO settings (key, value, description)
      VALUES 
        ('site_title', 'Rudri Dave', 'Website title'),
        ('site_description', 'Personal website and research papers', 'Website description'),
        ('contact_email', 'admin@rudri.com', 'Contact email address'),
        ('enable_blog', 'true', 'Enable blog functionality'),
        ('enable_papers', 'true', 'Enable research papers functionality')
      ON CONFLICT (key) DO NOTHING
    `);
    console.log('✅ Default settings created');
    
    console.log('🎉 Database initialization completed successfully!');
    
    // Display database info
    const result = await db.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    
    console.log('📊 Database Information:');
    console.log(`Database: ${result.rows[0].database}`);
    console.log(`User: ${result.rows[0].user}`);
    console.log(`Version: ${result.rows[0].version}`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;