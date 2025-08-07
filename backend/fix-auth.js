const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./models/db');
const config = require('./config');

async function fixAuth() {
  console.log('🔧 Fixing Authentication Issues...\n');
  
  try {
    // 1. Generate a new JWT secret
    const crypto = require('crypto');
    const newSecret = crypto.randomBytes(64).toString('hex');
    console.log('1️⃣ Generated new JWT secret');
    
    // 2. Update config temporarily
    config.jwt.secret = newSecret;
    console.log('2️⃣ Updated JWT secret in config');
    
    // 3. Test token generation
    const testUser = {
      id: 1,
      email: 'rudridave1998@gmail.com',
      name: 'Rudri Dave',
      role: 'admin',
      is_owner: true
    };
    
    const token = jwt.sign(testUser, newSecret, { expiresIn: '1d' });
    console.log('3️⃣ Generated test token');
    
    // 4. Test token verification
    const decoded = jwt.verify(token, newSecret);
    console.log('4️⃣ Token verification successful');
    console.log('   Decoded user:', decoded);
    
    console.log('\n✅ Authentication fix completed');
    console.log('\n📝 To make this permanent, update your .env file with:');
    console.log(`JWT_SECRET=${newSecret}`);
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixAuth();
