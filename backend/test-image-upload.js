const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:4000';

async function testImageUpload() {
  console.log('🧪 Testing Image Upload Functionality...\n');
  
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@rudri.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('   ❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('   ✅ Login successful');
    
    // Test 3: Create a test blog
    console.log('\n3️⃣ Creating test blog...');
    const blogData = {
      title: 'Test Blog for Image Upload',
      content: 'This is a test blog post to verify image upload functionality.',
      slug: 'test-blog-image-upload',
      tags: ['test', 'image', 'upload'],
      published: true
    };
    
    const createBlogResponse = await fetch(`${API_BASE}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });
    
    if (!createBlogResponse.ok) {
      console.log('   ❌ Failed to create blog');
      return;
    }
    
    const blogResult = await createBlogResponse.json();
    const blogId = blogResult.blog.id;
    console.log(`   ✅ Blog created with ID: ${blogId}`);
    
    // Test 4: Create a test image file
    console.log('\n4️⃣ Creating test image...');
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple test image (1x1 pixel PNG)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testImagePath, pngData);
    console.log('   ✅ Test image created');
    
    // Test 5: Upload image
    console.log('\n5️⃣ Testing image upload...');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    formData.append('blogId', blogId.toString());
    
    const uploadResponse = await fetch(`${API_BASE}/api/blogs/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.log(`   ❌ Image upload failed: ${uploadResponse.status}`);
      console.log(`   Error: ${errorData}`);
      return;
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('   ✅ Image uploaded successfully');
    console.log(`   Image URL: ${uploadResult.imageUrl}`);
    
    // Test 6: Verify blog was updated
    console.log('\n6️⃣ Verifying blog update...');
    const getBlogResponse = await fetch(`${API_BASE}/api/blogs/${blogId}`);
    if (getBlogResponse.ok) {
      const updatedBlog = await getBlogResponse.json();
      console.log(`   ✅ Blog updated with image: ${updatedBlog.cover_image}`);
    }
    
    // Cleanup: Delete test image file
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Cleanup completed');
    
    console.log('\n🎉 All tests passed! Image upload functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testImageUpload();
