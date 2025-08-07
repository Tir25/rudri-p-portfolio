/**
 * Simple cleanup script to remove test/dummy data
 * Focuses on blogs and basic cleanup
 */

require('dotenv').config();
const db = require('./models/db');

async function simpleCleanup() {
  console.log('🧹 Simple cleanup of test data...\n');
  
  try {
    // Check connection
    const connected = await db.checkConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Clean up blogs
    console.log('\n📝 Cleaning up blogs...');
    const blogsQuery = 'SELECT * FROM blogs ORDER BY id DESC';
    const blogsResult = await db.query(blogsQuery);
    
    const testBlogPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /^[a-z]{3,}$/i, // Short titles like "ddd", "wmwwkww"
      /^[a-z]+$/i, // Single word titles
    ];
    
    const blogsToDelete = [];
    const blogsToKeep = [];
    
    blogsResult.rows.forEach((blog) => {
      const isTestData = testBlogPatterns.some(pattern => 
        pattern.test(blog.title) || 
        pattern.test(blog.slug) ||
        (blog.content && blog.content.length < 50) // Very short content
      );
      
      if (isTestData) {
        blogsToDelete.push(blog);
        console.log(`   ❌ Marked for deletion: "${blog.title}" (ID: ${blog.id})`);
      } else {
        blogsToKeep.push(blog);
        console.log(`   ✅ Keeping: "${blog.title}" (ID: ${blog.id})`);
      }
    });
    
    // Delete test blogs
    for (const blog of blogsToDelete) {
      try {
        await db.query('DELETE FROM blogs WHERE id = $1', [blog.id]);
        console.log(`   🗑️  Deleted blog ID ${blog.id}: "${blog.title}"`);
      } catch (error) {
        console.error(`   ❌ Failed to delete blog ID ${blog.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Blog cleanup completed:`);
    console.log(`   ✅ Kept: ${blogsToKeep.length} blogs`);
    console.log(`   🗑️  Deleted: ${blogsToDelete.length} test blogs`);
    
    // Show remaining data
    console.log('\n📊 Current data counts:');
    const tables = ['blogs', 'users', 'sessions'];
    
    for (const table of tables) {
      try {
        const result = await db.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        console.log(`   ${table}: ${count} records`);
      } catch (error) {
        console.log(`   ${table}: Error counting records`);
      }
    }
    
    console.log('\n✨ Cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run cleanup
simpleCleanup();

