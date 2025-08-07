const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE = 'http://localhost:4000';

async function debugUpload() {
  console.log('🔍 Debugging Image Upload...\n');
  
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
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      const errorData = await loginResponse.json();
      console.log('Error:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    
    // Test 2: Create a simple blog
    console.log('\n2️⃣ Creating test blog...');
    const blogData = {
      title: 'Test Blog for Upload',
      content: 'This is a test blog for image upload debugging.',
      tags: ['test', 'debug'],
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
      console.log('❌ Blog creation failed');
      const errorData = await createResponse.json();
      console.log('Error:', errorData);
      return;
    }
    
    const createdBlog = await createResponse.json();
    console.log('✅ Blog created successfully');
    console.log('Blog ID:', createdBlog.blog?.id);
    
    // Test 3: Upload image
    console.log('\n3️⃣ Testing image upload...');
    
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, 'This is a test image file');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), 'test-image.png');
    formData.append('blogId', createdBlog.blog.id.toString());
    
    console.log('📁 FormData created with:');
    console.log('   - image file: test-image.png');
    console.log('   - blogId:', createdBlog.blog.id);
    
    const uploadResponse = await fetch(`${API_BASE}/api/blogs/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    console.log('📊 Upload response status:', uploadResponse.status);
    console.log('📊 Upload response statusText:', uploadResponse.statusText);
    
    if (!uploadResponse.ok) {
      console.log('❌ Image upload failed');
      const errorData = await uploadResponse.text();
      console.log('Error response:', errorData);
      return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Image upload successful');
    console.log('Upload data:', uploadData);
    
    // Clean up
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

debugUpload();
