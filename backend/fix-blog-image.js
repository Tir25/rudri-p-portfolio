const dbUtils = require('./models/dbUtils');

async function fixBlogImage() {
  console.log('🔧 Fixing blog cover image...\n');
  
  try {
    // Get the blog with ID 14
    const blog = await dbUtils.getById('blogs', 14);
    
    if (!blog) {
      console.log('❌ Blog not found');
      return;
    }
    
    console.log(`📝 Found blog: "${blog.title}" (ID: ${blog.id})`);
    console.log(`   Current cover_image: "${blog.cover_image || 'None'}"`);
    
    // Update the blog with the correct cover image path
    const imagePath = '/uploads/image-1754560239489-616826795.png';
    
    const updatedBlog = await dbUtils.update('blogs', 14, {
      cover_image: imagePath,
      updated_at: new Date().toISOString()
    });
    
    console.log(`✅ Updated blog cover_image to: "${imagePath}"`);
    console.log(`   New cover_image: "${updatedBlog.cover_image}"`);
    
    // Verify the update
    const verifyBlog = await dbUtils.getById('blogs', 14);
    console.log(`\n✅ Verification - Blog cover_image: "${verifyBlog.cover_image}"`);
    
  } catch (error) {
    console.error('❌ Error fixing blog image:', error);
  }
}

fixBlogImage();
