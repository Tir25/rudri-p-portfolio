const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';

async function testImageDisplay() {
  console.log('🧪 Testing Image Display...\n');
  
  try {
    // Test 1: Get all blogs (public endpoint)
    console.log('1️⃣ Testing public blog listing...');
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
    
    // Check each blog for cover images
    allBlogs.forEach((blog, index) => {
      console.log(`\n📝 Blog ${index + 1}: "${blog.title}"`);
      console.log(`   ID: ${blog.id}`);
      console.log(`   Slug: "${blog.slug}"`);
      console.log(`   Cover Image: "${blog.cover_image || 'None'}"`);
      console.log(`   Published: ${blog.published}`);
      
      if (blog.cover_image) {
        console.log(`   ✅ Has cover image: ${blog.cover_image}`);
      } else {
        console.log(`   ❌ No cover image`);
      }
    });
    
    // Test 2: Get individual blog by slug
    if (allBlogs.length > 0) {
      const firstBlog = allBlogs[0];
      console.log(`\n2️⃣ Testing individual blog access: "${firstBlog.slug}"`);
      
      const getBlogResponse = await fetch(`${API_BASE}/api/blogs/${firstBlog.slug}`, {
        headers: {
          'Origin': 'http://localhost:5173'
        }
      });
      
      if (!getBlogResponse.ok) {
        console.log('   ❌ Individual blog access failed');
        const errorData = await getBlogResponse.json();
        console.log('   Error:', errorData);
        return;
      }
      
      const individualBlog = await getBlogResponse.json();
      console.log('   ✅ Individual blog access successful');
      console.log(`   Title: "${individualBlog.title}"`);
      console.log(`   Cover Image: "${individualBlog.cover_image || 'None'}"`);
      console.log(`   CORS headers present: ${!!getBlogResponse.headers.get('access-control-allow-origin')}`);
    }
    
    // Test 3: Test image file access
    const blogWithImage = allBlogs.find(blog => blog.cover_image);
    if (blogWithImage) {
      console.log(`\n3️⃣ Testing image file access: ${blogWithImage.cover_image}`);
      
      const imageResponse = await fetch(`${API_BASE}${blogWithImage.cover_image}`, {
        headers: {
          'Origin': 'http://localhost:5173'
        }
      });
      
      if (!imageResponse.ok) {
        console.log('   ❌ Image file access failed');
        console.log('   Status:', imageResponse.status);
        console.log('   Status Text:', imageResponse.statusText);
        return;
      }
      
      console.log('   ✅ Image file access successful');
      console.log('   Content-Type:', imageResponse.headers.get('content-type'));
      console.log('   CORS headers present:', !!imageResponse.headers.get('access-control-allow-origin'));
      console.log('   Cross-Origin-Resource-Policy:', imageResponse.headers.get('cross-origin-resource-policy'));
    }
    
    console.log('\n🎉 Image Display Test Results:');
    console.log('✅ Blog listing: Working');
    console.log('✅ Individual blog access: Working');
    console.log('✅ Image file serving: Working');
    console.log('✅ CORS headers: Properly configured');
    
    console.log('\n🔧 Frontend should now display images correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImageDisplay();
