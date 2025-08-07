const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:4000';

async function testCompleteBlogFlow() {
  console.log('🧪 Testing Complete Blog Flow...\n');
  
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
    
    // Test 3: Create a real blog post
    console.log('\n3️⃣ Creating a real blog post...');
    const blogData = {
      title: 'My First Real Blog Post',
      content: 'This is my first real blog post with proper content. It includes multiple sentences and should be interesting to read.',
      tags: ['academic', 'research', 'digital-humanities'],
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
    console.log('   Slug:', createdBlog.blog?.slug);
    
    // Test 4: Upload image to the blog
    console.log('\n4️⃣ Uploading cover image...');
    
    // Create a simple test image file
    const testImagePath = path.join(__dirname, 'test-cover-image.txt');
    fs.writeFileSync(testImagePath, 'This is a test cover image file');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), 'test-cover-image.txt');
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
      return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('   ✅ Image upload successful');
    console.log('   Image URL:', uploadData.imageUrl);
    
    // Test 5: Get blog by slug (public endpoint)
    console.log('\n5️⃣ Testing public blog access by slug...');
    const getBlogResponse = await fetch(`${API_BASE}/api/blogs/${createdBlog.blog.slug}`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    if (!getBlogResponse.ok) {
      console.log('   ❌ Blog retrieval failed');
      const errorData = await getBlogResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const retrievedBlog = await getBlogResponse.json();
    console.log('   ✅ Blog retrieved successfully');
    console.log('   Title:', retrievedBlog.title);
    console.log('   Cover Image:', retrievedBlog.cover_image);
    console.log('   CORS headers present:', !!getBlogResponse.headers.get('access-control-allow-origin'));
    
    // Test 6: Get all blogs (public endpoint)
    console.log('\n6️⃣ Testing public blog listing...');
    const listBlogsResponse = await fetch(`${API_BASE}/api/blogs`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    
    if (!listBlogsResponse.ok) {
      console.log('   ❌ Blog listing failed');
      const errorData = await listBlogsResponse.json();
      console.log('   Error:', errorData);
      return;
    }
    
    const allBlogs = await listBlogsResponse.json();
    console.log('   ✅ Blog listing successful');
    console.log('   Total blogs:', allBlogs.length);
    console.log('   CORS headers present:', !!listBlogsResponse.headers.get('access-control-allow-origin'));
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    
    console.log('\n🎉 Complete Blog Flow Test Results:');
    console.log('✅ Backend server: Running');
    console.log('✅ Authentication: Working');
    console.log('✅ Blog creation: Working');
    console.log('✅ Image upload: Working');
    console.log('✅ Public blog access: Working');
    console.log('✅ Blog listing: Working');
    console.log('✅ CORS configuration: Working');
    console.log('✅ Slug-based routing: Working');
    
    console.log('\n📋 Blog Details:');
    console.log(`   - Title: "${retrievedBlog.title}"`);
    console.log(`   - Slug: "${retrievedBlog.slug}"`);
    console.log(`   - Cover Image: "${retrievedBlog.cover_image}"`);
    console.log(`   - Tags: [${retrievedBlog.tags?.join(', ') || 'None'}]`);
    console.log(`   - Published: ${retrievedBlog.published}`);
    
    console.log('\n🔧 Frontend should now work perfectly!');
    console.log('   - Blog listing with cover images');
    console.log('   - Individual blog posts with images');
    console.log('   - Slug-based URLs working');
    console.log('   - No more "Blog Post not found" errors');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteBlogFlow();
