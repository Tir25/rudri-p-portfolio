/**
 * Comprehensive cleanup script to remove all dummy/test data
 * This script cleans up blogs, papers, and other test data
 */

require('dotenv').config();
const db = require('./models/db');

async function cleanupAllDummyData() {
  console.log('🧹 Comprehensive cleanup of all dummy data...\n');
  
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
    const blogsQuery = 'SELECT * FROM blogs ORDER BY created_at DESC';
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
    
    // Clean up papers
    console.log('\n📄 Cleaning up papers...');
    const papersQuery = 'SELECT * FROM papers ORDER BY created_at DESC';
    const papersResult = await db.query(papersQuery);
    
    const testPaperPatterns = [
      /test/i,
      /dummy/i,
      /sample/i,
      /^[a-z]{3,}$/i,
      /^[a-z]+$/i,
    ];
    
    const papersToDelete = [];
    const papersToKeep = [];
    
    papersResult.rows.forEach((paper) => {
      const isTestData = testPaperPatterns.some(pattern => 
        pattern.test(paper.title) || 
        pattern.test(paper.filename) ||
        (paper.description && paper.description.length < 20)
      );
      
      if (isTestData) {
        papersToDelete.push(paper);
        console.log(`   ❌ Marked for deletion: "${paper.title}" (ID: ${paper.id})`);
      } else {
        papersToKeep.push(paper);
        console.log(`   ✅ Keeping: "${paper.title}" (ID: ${paper.id})`);
      }
    });
    
    // Delete test papers
    for (const paper of papersToDelete) {
      try {
        await db.query('DELETE FROM papers WHERE id = $1', [paper.id]);
        console.log(`   🗑️  Deleted paper ID ${paper.id}: "${paper.title}"`);
      } catch (error) {
        console.error(`   ❌ Failed to delete paper ID ${paper.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Paper cleanup completed:`);
    console.log(`   ✅ Kept: ${papersToKeep.length} papers`);
    console.log(`   🗑️  Deleted: ${papersToDelete.length} test papers`);
    
    // Clean up other tables
    console.log('\n🧹 Cleaning up other tables...');
    
    // Clean up audit logs (keep only recent ones)
    try {
      const auditResult = await db.query('SELECT COUNT(*) FROM audit_logs');
      const auditCount = parseInt(auditResult.rows[0].count);
      
      if (auditCount > 100) {
        const deleteOldAuditQuery = `
          DELETE FROM audit_logs 
          WHERE created_at < NOW() - INTERVAL '30 days'
        `;
        await db.query(deleteOldAuditQuery);
        console.log(`   🗑️  Cleaned up old audit logs (kept last 30 days)`);
      }
    } catch (error) {
      console.log(`   ⚠️  Audit logs cleanup skipped: ${error.message}`);
    }
    
    // Clean up sessions (keep only recent ones)
    try {
      const sessionResult = await db.query('SELECT COUNT(*) FROM sessions');
      const sessionCount = parseInt(sessionResult.rows[0].count);
      
      if (sessionCount > 50) {
        const deleteOldSessionsQuery = `
          DELETE FROM sessions 
          WHERE created_at < NOW() - INTERVAL '7 days'
        `;
        await db.query(deleteOldSessionsQuery);
        console.log(`   🗑️  Cleaned up old sessions (kept last 7 days)`);
      }
    } catch (error) {
      console.log(`   ⚠️  Sessions cleanup skipped: ${error.message}`);
    }
    
    // Final summary
    console.log('\n🎉 Comprehensive cleanup completed!');
    console.log('\n📋 Final Summary:');
    console.log(`   📝 Blogs: ${blogsToKeep.length} kept, ${blogsToDelete.length} deleted`);
    console.log(`   📄 Papers: ${papersToKeep.length} kept, ${papersToDelete.length} deleted`);
    console.log(`   🧹 Other tables: Cleaned up old audit logs and sessions`);
    
    // Show remaining data
    console.log('\n📊 Current data counts:');
    const tables = ['blogs', 'papers', 'users', 'sessions', 'audit_logs'];
    
    for (const table of tables) {
      try {
        const result = await db.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        console.log(`   ${table}: ${count} records`);
      } catch (error) {
        console.log(`   ${table}: Error counting records`);
      }
    }
    
    console.log('\n✨ Database is now clean and ready for production use!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run cleanup
cleanupAllDummyData();











