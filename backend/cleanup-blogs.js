/**
 * Cleanup script to remove test and dummy blog posts
 * This script removes blogs that appear to be test data
 */

require('dotenv').config();
const db = require('./models/db');

async function cleanupBlogs() {
  console.log('🧹 Cleaning up test and dummy blog posts...\n');
  
  try {
    // Check connection
    const connected = await db.checkConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Get all blogs
    const blogsQuery = 'SELECT * FROM blogs ORDER BY created_at DESC';
    const blogsResult = await db.query(blogsQuery);
    
    console.log(`📊 Found ${blogsResult.rows.length} blogs:\n`);
    
    // Define patterns for test/dummy blogs to remove
    const testPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /^[a-z]{3,}$/i, // Short titles like "ddd", "wmwwkww"
      /^[a-z]+$/i, // Single word titles
    ];
    
    const blogsToDelete = [];
    const blogsToKeep = [];
    
    blogsResult.rows.forEach((blog, index) => {
      console.log(`${index + 1}. Blog ID: ${blog.id}`);
      console.log(`   Title: "${blog.title}"`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Content length: ${blog.content ? blog.content.length : 0} characters`);
      
      // Check if this looks like test data
      const isTestData = testPatterns.some(pattern => 
        pattern.test(blog.title) || 
        pattern.test(blog.slug) ||
        (blog.content && blog.content.length < 50) // Very short content
      );
      
      if (isTestData) {
        blogsToDelete.push(blog);
        console.log(`   ❌ Marked for deletion (test data)`);
      } else {
        blogsToKeep.push(blog);
        console.log(`   ✅ Keeping (real blog)`);
      }
      console.log('');
    });
    
    console.log(`🗑️  Blogs to delete: ${blogsToDelete.length}`);
    console.log(`✅ Blogs to keep: ${blogsToKeep.length}`);
    
    if (blogsToDelete.length === 0) {
      console.log('🎉 No test blogs found to delete!');
      return;
    }
    
    // Ask for confirmation
    console.log('\n⚠️  About to delete the following blogs:');
    blogsToDelete.forEach(blog => {
      console.log(`   - "${blog.title}" (ID: ${blog.id})`);
    });
    
    console.log('\n❓ Do you want to proceed? (y/N)');
    
    // For now, let's just log what would be deleted
    console.log('\n📝 To delete these blogs, run the following SQL:');
    blogsToDelete.forEach(blog => {
      console.log(`DELETE FROM blogs WHERE id = ${blog.id};`);
    });
    
    console.log('\n💡 You can run these commands manually in your database if you want to delete them.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run cleanup
cleanupBlogs();
