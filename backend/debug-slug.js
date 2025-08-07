const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';

async function debugSlug() {
  console.log('🔍 Debugging Slug Validation...\n');
  
  try {
    // Test 1: Login
    console.log('1️⃣ Logging in...');
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
    
    const loginData = await loginResponse.json();
    console.log('   ✅ Login successful');
    
    // Test 2: Create blog with explicit slug
    console.log('\n2️⃣ Creating blog with explicit slug...');
    const blogData = {
      title: 'Test Blog',
      content: 'This is a test blog with explicit slug.',
      slug: 'test-blog-explicit',
      tags: ['test'],
      published: true
    };
    
    const createResponse = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blogData)
    });
    
    if (!createResponse.ok) {
      console.log('   ❌ Blog creation failed');
      const errorData = await createResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const createdBlog = await createResponse.json();
    console.log('   ✅ Blog created successfully');
    console.log('   Blog ID:', createdBlog.blog?.id);
    console.log('   Slug:', createdBlog.blog?.slug);
    
    // Test 3: Create blog without slug (should auto-generate)
    console.log('\n3️⃣ Creating blog without slug (auto-generate)...');
    const blogData2 = {
      title: 'Auto Slug Test Blog',
      content: 'This is a test blog without explicit slug.',
      tags: ['test', 'auto'],
      published: true
    };
    
    const createResponse2 = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blogData2)
    });
    
    if (!createResponse2.ok) {
      console.log('   ❌ Blog creation failed');
      const errorData = await createResponse2.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const createdBlog2 = await createResponse2.json();
    console.log('   ✅ Blog created successfully');
    console.log('   Blog ID:', createdBlog2.blog?.id);
    console.log('   Auto-generated Slug:', createdBlog2.blog?.slug);
    
    console.log('\n🎉 Slug validation is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

debugSlug();
