const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';

async function testAuthDebug() {
  console.log('🔍 Debugging Authentication...\n');
  
  try {
    // Test 1: Login
    console.log('1️⃣ Testing login...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'rudridave1998@gmail.com',
        password: '19111998'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('   ❌ Login failed');
      const errorData = await loginResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('   ✅ Login successful');
    console.log('   User:', loginData.user?.email);
    console.log('   Token length:', loginData.token?.length);
    
    // Test 2: Test token with Authorization header
    console.log('\n2️⃣ Testing token with Authorization header...');
    const headers = {
      'Authorization': `Bearer ${loginData.token}`,
      'Content-Type': 'application/json'
    };
    
    const profileResponse = await fetch(`${API_BASE}/api/auth/profile`, {
      headers
    });
    
    if (!profileResponse.ok) {
      console.log('   ❌ Profile fetch failed');
      const errorData = await profileResponse.json();
      console.log('   Error:', errorData);
    } else {
      const profileData = await profileResponse.json();
      console.log('   ✅ Profile fetch successful');
      console.log('   Profile:', profileData);
    }
    
    // Test 3: Test blog creation with token
    console.log('\n3️⃣ Testing blog creation with token...');
    const blogData = {
      title: 'Debug Test Blog',
      content: 'This is a debug test blog post.',
      slug: 'debug-test-blog',
      tags: ['debug', 'test'],
      published: true
    };
    
    const createResponse = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData)
    });
    
    if (!createResponse.ok) {
      console.log('   ❌ Blog creation failed');
      const errorData = await createResponse.json();
      console.log('   Error:', errorData);
    } else {
      const createdBlog = await createResponse.json();
      console.log('   ✅ Blog creation successful');
      console.log('   Blog:', createdBlog);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthDebug();
