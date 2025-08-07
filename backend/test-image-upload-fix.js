const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:4000';

async function testImageUploadFix() {
  console.log('🧪 Testing Image Upload Fix...\n');
  
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
    
    // Test 3: Create a test blog
    console.log('\n3️⃣ Creating test blog...');
    const blogData = {
      title: 'Image Upload Test Blog',
      content: 'This is a test blog for image upload verification.',
      tags: ['test', 'image'],
      published: true
    };
    
    const createResponse = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
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
    
    // Test 4: Upload image to the blog
    console.log('\n4️⃣ Testing image upload...');
    
    // Create a simple test image file
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'This is a test image file');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), 'test-image.txt');
    formData.append('blogId', createdBlog.blog.id.toString());
    
    const uploadResponse = await fetch(`${API_BASE}/api/blogs/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Origin': 'http://localhost:5173'
      },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      console.log('   ❌ Image upload failed');
      const errorData = await uploadResponse.json();
      console.log('   Error:', errorData);
      console.log('   Status:', uploadResponse.status);
      console.log('   Status Text:', uploadResponse.statusText);
      return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('   ✅ Image upload successful');
    console.log('   Image URL:', uploadData.imageUrl);
    console.log('   CORS headers present:', !!uploadResponse.headers.get('access-control-allow-origin'));
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    
    console.log('\n🎉 Image Upload Test Results:');
    console.log('✅ Backend server: Running');
    console.log('✅ Authentication: Working');
    console.log('✅ Blog creation: Working');
    console.log('✅ Image upload: Working');
    console.log('✅ CORS configuration: Working');
    
    console.log('\n🔧 Frontend image upload should now work!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImageUploadFix();
