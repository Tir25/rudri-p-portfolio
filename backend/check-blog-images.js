const dbUtils = require('./models/dbUtils');

async function checkBlogImages() {
  console.log('🔍 Checking blog images in database...\n');
  
  try {
    // Get all blogs
    const allBlogs = await dbUtils.getAll('blogs', {}, 100, 0);
    console.log(`📋 Found ${allBlogs.length} total blogs`);
    
    allBlogs.forEach(blog => {
      console.log(`\n📝 Blog: "${blog.title}" (ID: ${blog.id})`);
      console.log(`   Slug: "${blog.slug}"`);
      console.log(`   Cover Image: "${blog.cover_image || 'None'}"`);
      console.log(`   Published: ${blog.published}`);
      console.log(`   Created: ${blog.created_at}`);
      console.log(`   Updated: ${blog.updated_at}`);
    });
    
    // Check if uploads directory exists and has files
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`\n📁 Uploads directory contains ${files.length} files:`);
      files.forEach(file => {
        console.log(`   - ${file}`);
      });
    } else {
      console.log('\n❌ Uploads directory does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error checking blog images:', error);
  }
}

checkBlogImages();
