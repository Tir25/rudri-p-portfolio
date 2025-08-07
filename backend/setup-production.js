#!/usr/bin/env node

/**
 * Production Setup Script
 * This script helps configure the production environment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Production Setup for Rudri Dave Website');
console.log('==========================================\n');

// Generate JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Create production .env file
const createProductionEnv = async () => {
  const envContent = `# Production Environment Configuration
# Generated on ${new Date().toISOString()}

# Environment
NODE_ENV=production
PORT=4000

# Database Configuration (Production)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password
DB_NAME=rudri_db_production
DB_SSL=true

# JWT Configuration
JWT_SECRET=${generateJWTSecret()}
JWT_EXPIRES_IN=1d

# Admin User Configuration
ADMIN_EMAIL=rudridave1998@gmail.com
ADMIN_PASSWORD=19111998

# CORS Configuration (Your domain)
CORS_ORIGIN=https://yourdomain.com
PRODUCTION_DOMAIN=yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Configuration
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_MAX_AGE=86400000

# HTTPS Configuration
SSL_KEY_PATH=./ssl/private.key
SSL_CERT_PATH=./ssl/certificate.crt
`;

  fs.writeFileSync(path.join(__dirname, '.env.production'), envContent);
  console.log('✅ Production .env file created');
};

// Create SSL directory structure
const createSSLStructure = () => {
  const sslDir = path.join(__dirname, 'ssl');
  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
    console.log('✅ SSL directory created');
  }
  
  // Create placeholder files
  const keyPath = path.join(sslDir, 'private.key');
  const certPath = path.join(sslDir, 'certificate.crt');
  
  if (!fs.existsSync(keyPath)) {
    fs.writeFileSync(keyPath, '# Place your SSL private key here\n');
    console.log('✅ SSL private key placeholder created');
  }
  
  if (!fs.existsSync(certPath)) {
    fs.writeFileSync(certPath, '# Place your SSL certificate here\n');
    console.log('✅ SSL certificate placeholder created');
  }
};

// Create production deployment script
const createDeployScript = () => {
  const deployScript = `#!/bin/bash
# Production Deployment Script

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Production environment file not found"
    echo "Run: node setup-production.js"
    exit 1
fi

# Copy production env to .env
cp .env.production .env

# Install dependencies
npm install --production

# Run database migrations
npm run migrate

# Start the server
npm start
`;

  fs.writeFileSync(path.join(__dirname, 'deploy.sh'), deployScript);
  fs.chmodSync(path.join(__dirname, 'deploy.sh'), '755');
  console.log('✅ Deployment script created');
};

// Main setup function
const setupProduction = async () => {
  try {
    console.log('📋 Setting up production environment...\n');
    
    // Create production .env
    await createProductionEnv();
    
    // Create SSL structure
    createSSLStructure();
    
    // Create deployment script
    createDeployScript();
    
    console.log('\n✅ Production setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update .env.production with your actual database credentials');
    console.log('2. Add your SSL certificates to the ssl/ directory');
    console.log('3. Update PRODUCTION_DOMAIN with your actual domain');
    console.log('4. Run: ./deploy.sh to start production server');
    
    console.log('\n🔒 Security Checklist:');
    console.log('✅ JWT secret generated');
    console.log('✅ Admin credentials configured');
    console.log('✅ HTTPS structure created');
    console.log('✅ Production environment file created');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run setup
setupProduction();
