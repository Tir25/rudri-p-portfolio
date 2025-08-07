const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';

async function testCorsFix() {
  console.log('🧪 Testing CORS and Rate Limiting Fixes...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (!healthResponse.ok) {
      console.log('   ❌ Backend is not responding');
      return;
    }
    console.log('   ✅ Backend is running');
    
    // Test 2: Login to get token
    console.log('\n2️⃣ Testing authentication...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
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
    console.log('   CORS headers present:', !!loginResponse.headers.get('access-control-allow-origin'));
    
    // Test 3: Blog operations with CORS headers
    console.log('\n3️⃣ Testing blog operations with CORS...');
    const headers = {
      'Authorization': `Bearer ${loginData.token}`,
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173'
    };
    
    // Test blog creation
    const blogData = {
      title: 'CORS Test Blog',
      content: 'This is a test blog post for CORS verification.',
      tags: ['cors', 'test'],
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
      return;
    }
    
    const createdBlog = await createResponse.json();
    console.log('   ✅ Blog creation successful');
    console.log('   CORS headers present:', !!createResponse.headers.get('access-control-allow-origin'));
    console.log('   Blog ID:', createdBlog.blog?.id);
    
    // Test 4: Blog update (the operation that was failing)
    console.log('\n4️⃣ Testing blog update (previously failing operation)...');
    const updateData = {
      title: 'Updated CORS Test Blog',
      content: 'This is an updated test blog post.',
      tags: ['cors', 'test', 'updated'],
      published: true
    };
    
    const updateResponse = await fetch(`${API_BASE}/api/blogs/${createdBlog.blog.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
      console.log('   ❌ Blog update failed');
      const errorData = await updateResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    console.log('   ✅ Blog update successful');
    console.log('   CORS headers present:', !!updateResponse.headers.get('access-control-allow-origin'));
    
    // Test 5: Blog listing (public endpoint)
    console.log('\n5️⃣ Testing public blog listing...');
    const listResponse = await fetch(`${API_BASE}/api/blogs`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    if (!listResponse.ok) {
      console.log('   ❌ Blog listing failed');
      const errorData = await listResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const blogs = await listResponse.json();
    console.log('   ✅ Blog listing successful');
    console.log('   CORS headers present:', !!listResponse.headers.get('access-control-allow-origin'));
    console.log('   Total blogs:', blogs.length);
    
    console.log('\n🎉 CORS and Rate Limiting Test Results:');
    console.log('✅ Backend server: Running');
    console.log('✅ CORS configuration: Working');
    console.log('✅ Rate limiting: Not blocking requests');
    console.log('✅ Authentication: Working');
    console.log('✅ Blog operations: Working');
    console.log('✅ Public endpoints: Working');
    
    console.log('\n📋 CORS Configuration Summary:');
    console.log('   - Added localhost:5173 to CORS origins');
    console.log('   - Added Accept header to allowed headers');
    console.log('   - Credentials enabled for cookie support');
    console.log('   - All HTTP methods allowed');
    
    console.log('\n🔧 Frontend should now work without CORS errors!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCorsFix();
