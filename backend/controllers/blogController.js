const dbUtils = require('../models/dbUtils');

// Utility function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens only
}

// Utility function to validate blog data
function validateBlogData(data) {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!data.content || data.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters');
  }
  
  // Only validate slug if it's provided and not empty
  if (data.slug !== undefined && data.slug !== null && data.slug !== '' && data.slug.trim().length < 3) {
    errors.push('Slug must be at least 3 characters');
  }
  
  return errors;
}

// List all blogs (public)
async function listBlogs(req, res) {
  try {
    console.log('📋 Fetching all blogs...');
    const blogs = await dbUtils.getAll('blogs', {}, 100, 0);
    console.log(`✅ Found ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}

// Get a single blog by ID or slug (public)
async function getBlog(req, res) {
  try {
    const { idOrSlug } = req.params;
    console.log('🔍 Fetching blog with ID/Slug:', idOrSlug);
    
    let blog;
    if (/^\d+$/.test(idOrSlug)) {
      blog = await dbUtils.getById('blogs', Number(idOrSlug));
    } else {
      const blogs = await dbUtils.getAll('blogs', { slug: idOrSlug }, 1, 0);
      blog = blogs[0];
    }
    
    if (!blog) {
      console.log('❌ Blog not found:', idOrSlug);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Blog found:', blog.title);
    res.json(blog);
  } catch (error) {
    console.error('❌ Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
}

// Create a new blog (admin only)
async function createBlog(req, res) {
  try {
    console.log('🚀 Starting blog creation...');
    console.log('📝 Request body:', req.body);
    console.log('👤 User:', req.user);
    
    const { title, content, slug, tags, published } = req.body;
    
    // Validate required fields (excluding slug if not provided)
    const validationData = { title, content };
    if (slug !== undefined && slug !== null && slug !== '') {
      validationData.slug = slug;
    }
    
    const validationErrors = validateBlogData(validationData);
    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Generate slug if not provided
    let finalSlug = slug || generateSlug(title);
    console.log('🔗 Initial slug:', finalSlug);
    
    // Check for unique slug and generate a new one if needed
    console.log('🔍 Checking for existing slug...');
    let exists = await dbUtils.getAll('blogs', { slug: finalSlug }, 1, 0);
    let attempts = 0;
    
    while (exists.length > 0 && attempts < 5) {
      attempts++;
      console.log(`⚠️ Slug already exists (attempt ${attempts}):`, finalSlug);
      
      // Add timestamp to make it unique
      const timestamp = Date.now().toString().slice(-6);
      finalSlug = `${finalSlug}-${timestamp}`;
      console.log('🔄 Generated new slug:', finalSlug);
      
      exists = await dbUtils.getAll('blogs', { slug: finalSlug }, 1, 0);
    }
    
    if (exists.length > 0) {
      console.log('❌ Could not generate unique slug after 5 attempts');
      return res.status(409).json({ error: 'Could not generate unique slug' });
    }
    
    console.log('✅ Final unique slug:', finalSlug);
    
    // Prepare blog data
    const blogData = {
      title: title.trim(),
      content: content.trim(),
      slug: finalSlug,
      tags: tags || [],
      published: published !== undefined ? published : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📦 Blog data to insert:', blogData);
    
    // Create blog in database
    console.log('💾 Inserting blog into database...');
    const blog = await dbUtils.create('blogs', blogData);
    console.log('✅ Blog created successfully:', blog);
    
    res.status(201).json({
      message: 'Blog created successfully',
      blog: blog
    });
    
  } catch (error) {
    console.error('❌ Error creating blog:', error);
    res.status(500).json({ 
      error: 'Failed to create blog', 
      details: error.message 
    });
  }
}

// Update a blog (admin only)
async function updateBlog(req, res) {
  try {
    const { idOrSlug } = req.params;
    console.log('🔄 Starting blog update for:', idOrSlug);
    console.log('📝 Request body:', req.body);
    
    const { title, content, slug, tags, published } = req.body;
    
    // Find existing blog
    let blog;
    if (/^\d+$/.test(idOrSlug)) {
      blog = await dbUtils.getById('blogs', Number(idOrSlug));
    } else {
      const blogs = await dbUtils.getAll('blogs', { slug: idOrSlug }, 1, 0);
      blog = blogs[0];
    }
    
    if (!blog) {
      console.log('❌ Blog not found:', idOrSlug);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Found existing blog:', blog.title);
    
    // Validate required fields
    const validationErrors = validateBlogData({ title, content, slug });
    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title);
    console.log('🔗 Using slug:', finalSlug);
    
    // Check for unique slug (excluding current blog)
    if (finalSlug !== blog.slug) {
      console.log('🔍 Checking for existing slug...');
      const exists = await dbUtils.getAll('blogs', { slug: finalSlug }, 1, 0);
      if (exists.length > 0) {
        console.log('❌ Slug already exists:', finalSlug);
        return res.status(409).json({ error: 'Slug already exists' });
      }
    }
    
    // Prepare update data
    const updateData = {
      title: title.trim(),
      content: content.trim(),
      slug: finalSlug,
      tags: tags || [],
      published: published !== undefined ? published : blog.published,
      updated_at: new Date().toISOString()
    };
    
    console.log('📦 Update data:', updateData);
    
    // Update blog in database
    console.log('💾 Updating blog in database...');
    const updated = await dbUtils.update('blogs', blog.id, updateData);
    console.log('✅ Blog updated successfully:', updated);
    
    res.json({
      message: 'Blog updated successfully',
      blog: updated
    });
    
  } catch (error) {
    console.error('❌ Error updating blog:', error);
    res.status(500).json({ 
      error: 'Failed to update blog', 
      details: error.message 
    });
  }
}

// Delete a blog (admin only)
async function deleteBlog(req, res) {
  try {
    const { idOrSlug } = req.params;
    console.log('🗑️ Starting blog deletion for:', idOrSlug);
    
    let blog;
    if (/^\d+$/.test(idOrSlug)) {
      blog = await dbUtils.getById('blogs', Number(idOrSlug));
    } else {
      const blogs = await dbUtils.getAll('blogs', { slug: idOrSlug }, 1, 0);
      blog = blogs[0];
    }
    
    if (!blog) {
      console.log('❌ Blog not found:', idOrSlug);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Found blog to delete:', blog.title);
    
    // Delete blog from database
    console.log('💾 Deleting blog from database...');
    await dbUtils.remove('blogs', blog.id);
    console.log('✅ Blog deleted successfully');
    
    res.json({ 
      message: 'Blog deleted successfully',
      success: true 
    });
    
  } catch (error) {
    console.error('❌ Error deleting blog:', error);
    res.status(500).json({ 
      error: 'Failed to delete blog', 
      details: error.message 
    });
  }
}

// Upload blog image (admin only)
async function uploadBlogImage(req, res) {
  try {
    console.log('🖼️ Starting blog image upload...');
    console.log('📁 Uploaded file:', req.file);
    console.log('📝 Request body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    const { blogId } = req.body;
    
    if (!blogId) {
      console.log('❌ No blog ID provided');
      return res.status(400).json({ error: 'Blog ID is required' });
    }
    
    // Find the blog
    console.log('🔍 Finding blog with ID:', blogId);
    const blog = await dbUtils.getById('blogs', Number(blogId));
    
    if (!blog) {
      console.log('❌ Blog not found:', blogId);
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    console.log('✅ Found blog:', blog.title);
    
    // Generate image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('🖼️ Image URL:', imageUrl);
    
    // Update blog with image URL
    console.log('💾 Updating blog with image URL...');
    const updatedBlog = await dbUtils.update('blogs', blog.id, {
      cover_image: imageUrl,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Blog updated with image:', updatedBlog);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      blog: updatedBlog
    });
    
  } catch (error) {
    console.error('❌ Error uploading blog image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
}

module.exports = {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
};