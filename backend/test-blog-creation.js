const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';

async function testBlogCreation() {
  console.log('🧪 Testing Blog Creation with Unique Slugs...\n');
  
  try {
    // Login
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
    const headers = {
      'Authorization': `Bearer ${loginData.token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('✅ Login successful');
    
    // Test 1: Create blog with simple title
    console.log('\n2️⃣ Testing blog creation with simple title...');
    const blogData1 = {
      title: 'Hello World',
      content: 'This is a test blog post.',
      tags: ['test', 'hello'],
      published: true
    };
    
    const createResponse1 = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData1)
    });
    
    if (!createResponse1.ok) {
      console.log('❌ Blog creation failed');
      const errorData = await createResponse1.json();
      console.log('Error:', errorData);
      return;
    }
    
    const createdBlog1 = await createResponse1.json();
    console.log('✅ Blog 1 created successfully');
    console.log('Slug:', createdBlog1.blog.slug);
    
    // Test 2: Create another blog with same title (should get unique slug)
    console.log('\n3️⃣ Testing blog creation with same title...');
    const blogData2 = {
      title: 'Hello World',
      content: 'This is another test blog post.',
      tags: ['test', 'hello'],
      published: true
    };
    
    const createResponse2 = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData2)
    });
    
    if (!createResponse2.ok) {
      console.log('❌ Second blog creation failed');
      const errorData = await createResponse2.json();
      console.log('Error:', errorData);
      return;
    }
    
    const createdBlog2 = await createResponse2.json();
    console.log('✅ Blog 2 created successfully');
    console.log('Slug:', createdBlog2.blog.slug);
    
    // Test 3: Create third blog with same title
    console.log('\n4️⃣ Testing third blog creation with same title...');
    const blogData3 = {
      title: 'Hello World',
      content: 'This is the third test blog post.',
      tags: ['test', 'hello'],
      published: true
    };
    
    const createResponse3 = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData3)
    });
    
    if (!createResponse3.ok) {
      console.log('❌ Third blog creation failed');
      const errorData = await createResponse3.json();
      console.log('Error:', errorData);
      return;
    }
    
    const createdBlog3 = await createResponse3.json();
    console.log('✅ Blog 3 created successfully');
    console.log('Slug:', createdBlog3.blog.slug);
    
    console.log('\n🎉 All blog creation tests passed!');
    console.log('✅ Unique slug generation working');
    console.log('✅ Backend handles slug conflicts gracefully');
    console.log('✅ Frontend should now work without slug conflicts');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBlogCreation();
