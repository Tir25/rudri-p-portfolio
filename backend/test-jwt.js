const jwt = require('jsonwebtoken');
const config = require('./config');

console.log('🔍 Testing JWT Configuration...\n');

// Test JWT secret
console.log('1️⃣ JWT Secret:', config.jwt.secret);
console.log('2️⃣ JWT Expires In:', config.jwt.expiresIn);

// Test token generation
const testUser = {
  id: 1,
  email: 'rudridave1998@gmail.com',
  name: 'Rudri Dave',
  role: 'admin',
  is_owner: true
};

console.log('\n3️⃣ Generating test token...');
const token = jwt.sign(testUser, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
console.log('   Token generated:', token.substring(0, 50) + '...');

// Test token verification
console.log('\n4️⃣ Verifying test token...');
try {
  const decoded = jwt.verify(token, config.jwt.secret);
  console.log('   ✅ Token verification successful');
  console.log('   Decoded user:', decoded);
} catch (error) {
  console.log('   ❌ Token verification failed:', error.message);
}

console.log('\n✅ JWT configuration test completed');
