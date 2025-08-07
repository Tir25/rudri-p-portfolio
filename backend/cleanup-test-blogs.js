const dbUtils = require('./models/dbUtils');

async function cleanupTestBlogs() {
  console.log('🧹 Cleaning up test blogs...\n');
  
  try {
    // Get all blogs
    const allBlogs = await dbUtils.getAll('blogs', {}, 100, 0);
    console.log(`📋 Found ${allBlogs.length} total blogs`);
    
    // Find test blogs to remove
    const testBlogs = allBlogs.filter(blog => 
      blog.title.toLowerCase().includes('test') ||
      blog.title.toLowerCase().includes('cors') ||
      blog.title.toLowerCase().includes('image upload') ||
      blog.title.toLowerCase().includes('auto slug')
    );
    
    console.log(`🎯 Found ${testBlogs.length} test blogs to remove:`);
    testBlogs.forEach(blog => {
      console.log(`   - ID: ${blog.id}, Title: "${blog.title}", Slug: "${blog.slug}"`);
    });
    
    if (testBlogs.length === 0) {
      console.log('✅ No test blogs found to remove');
      return;
    }
    
    // Remove test blogs
    for (const blog of testBlogs) {
      console.log(`🗑️ Removing blog: "${blog.title}" (ID: ${blog.id})`);
      await dbUtils.remove('blogs', blog.id);
      console.log(`✅ Removed blog ID: ${blog.id}`);
    }
    
    console.log(`\n🎉 Cleanup completed! Removed ${testBlogs.length} test blogs`);
    
    // Show remaining blogs
    const remainingBlogs = await dbUtils.getAll('blogs', {}, 100, 0);
    console.log(`\n📊 Remaining blogs: ${remainingBlogs.length}`);
    remainingBlogs.forEach(blog => {
      console.log(`   - ID: ${blog.id}, Title: "${blog.title}", Slug: "${blog.slug}"`);
    });
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupTestBlogs();
