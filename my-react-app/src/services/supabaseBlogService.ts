import { supabase } from '../lib/supabase';

export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  published: boolean;
  cover_image_url?: string;
  cover_image_path?: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  slug?: string;
  tags?: string[];
  published?: boolean;
  cover_image?: File;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  slug?: string;
  tags?: string[];
  published?: boolean;
  cover_image?: File;
}

// Utility function to generate slug from title
function generateSlug(title: string): string {
  if (!title || title.trim() === '') {
    return `blog-${Date.now()}`;
  }
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    || `blog-${Date.now()}`; // Fallback if result is empty
}

// Upload image to Supabase Storage
async function uploadBlogImage(file: File, blogId: string): Promise<{ url: string; path: string }> {
  console.log('🖼️ uploadBlogImage called with:', { fileName: file.name, fileSize: file.size, blogId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${blogId}-${Date.now()}.${fileExt}`;
  const filePath = `blog-images/${fileName}`;
  
  console.log('🖼️ Uploading to path:', filePath);

  const { data, error } = await supabase.storage
    .from('Blogs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('❌ Storage upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  console.log('✅ Storage upload successful:', data);

  const { data: { publicUrl } } = supabase.storage
    .from('Blogs')
    .getPublicUrl(filePath);

  console.log('🔗 Generated public URL:', publicUrl);

  return {
    url: publicUrl,
    path: filePath
  };
}

// Get all published blogs
export async function getPublishedBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return data || [];
}

// Get all blogs (admin only)
export async function getAllBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return data || [];
}

// Get blog by ID or slug
export async function getBlog(idOrSlug: string): Promise<Blog | null> {
  // First try to find by slug
  let { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', idOrSlug)
    .eq('published', true)
    .single();

  // If not found by slug, try by ID
  if (error && error.code === 'PGRST116') {
    const { data: dataById, error: errorById } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', idOrSlug)
      .eq('published', true)
      .single();
    
    data = dataById;
    error = errorById;
  }

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows returned
    }
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data;
}

// Create new blog
export async function createBlog(blogData: CreateBlogData): Promise<Blog> {
  console.log('🔍 createBlog called with data:', blogData);
  
  let user;
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    console.log('🔍 Auth check result:', { user: authUser?.email, error: authError });
    
    if (!authUser) {
      console.error('❌ No user found in createBlog');
      throw new Error('User must be authenticated to create blogs');
    }
    
    user = authUser;
    console.log('✅ User authenticated:', user.email);
  } catch (authError) {
    console.error('❌ Authentication error:', authError);
    throw new Error('Authentication failed. Please try logging in again.');
  }

  // Generate slug if not provided
  const slug = blogData.slug ? generateSlug(blogData.slug) : generateSlug(blogData.title);
  console.log('🔍 Generated slug:', slug);

  // Check if slug already exists
  const { data: existingBlog, error: slugCheckError } = await supabase
    .from('blogs')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
    
  console.log('🔍 Slug check result:', { existingBlog, error: slugCheckError });

  if (slugCheckError) {
    console.warn('⚠️ Slug check error (continuing anyway):', slugCheckError);
  }

  if (existingBlog) {
    throw new Error('A blog with this slug already exists');
  }

  // Prepare blog data
  const blogInsertData = {
    title: blogData.title,
    content: blogData.content,
    slug,
    tags: blogData.tags || [],
    published: blogData.published !== undefined ? blogData.published : true,
    author_id: user.id
  };

  // Insert blog
  const { data: blog, error: insertError } = await supabase
    .from('blogs')
    .insert(blogInsertData)
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create blog: ${insertError.message}`);
  }

  // Upload image if provided
  if (blogData.cover_image) {
    console.log('🖼️ Starting image upload for blog:', blog.id);
    try {
      const imageData = await uploadBlogImage(blogData.cover_image, blog.id);
      console.log('✅ Image uploaded successfully:', imageData);
      
      // Update blog with image data
      const { data: updatedBlog, error: updateError } = await supabase
        .from('blogs')
        .update({
          cover_image_url: imageData.url,
          cover_image_path: imageData.path
        })
        .eq('id', blog.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Failed to update blog with image:', updateError);
        return blog;
      }

      console.log('✅ Blog updated with image data:', updatedBlog);
      return updatedBlog;
    } catch (imageError) {
      console.error('❌ Failed to upload image:', imageError);
      return blog;
    }
  }

  return blog;
}

// Update blog
export async function updateBlog(id: string, blogData: UpdateBlogData): Promise<Blog> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to update blogs');
  }

  // Check if user is the author
  const { data: existingBlog } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!existingBlog) {
    throw new Error('Blog not found');
  }

  if (existingBlog.author_id !== user.id) {
    throw new Error('You can only update your own blogs');
  }

  // Prepare update data
  const updateData: Partial<Omit<Blog, 'id' | 'created_at' | 'updated_at'>> = {};
  if (blogData.title !== undefined) updateData.title = blogData.title;
  if (blogData.content !== undefined) updateData.content = blogData.content;
  if (blogData.tags !== undefined) updateData.tags = blogData.tags;
  if (blogData.published !== undefined) updateData.published = blogData.published;

  // Handle slug update
  if (blogData.slug !== undefined) {
    const newSlug = blogData.slug || (blogData.title ? generateSlug(blogData.title) : undefined);
    if (newSlug) {
      // Check if new slug already exists (excluding current blog)
      const { data: slugExists } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', id)
        .single();

      if (slugExists) {
        throw new Error('A blog with this slug already exists');
      }
      updateData.slug = newSlug;
    }
  }

  // Update blog
  const { data: blog, error: updateError } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update blog: ${updateError.message}`);
  }

  // Upload new image if provided
  if (blogData.cover_image) {
    try {
      const imageData = await uploadBlogImage(blogData.cover_image, blog.id);
      
      // Update blog with new image data
      const { data: updatedBlog, error: imageUpdateError } = await supabase
        .from('blogs')
        .update({
          cover_image_url: imageData.url,
          cover_image_path: imageData.path
        })
        .eq('id', blog.id)
        .select()
        .single();

      if (imageUpdateError) {
        console.error('Failed to update blog with image:', imageUpdateError);
        return blog;
      }

      return updatedBlog;
    } catch (imageError) {
      console.error('Failed to upload image:', imageError);
      return blog;
    }
  }

  return blog;
}

// Delete blog
export async function deleteBlog(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to delete blogs');
  }

  // Check if user is the author
  const { data: existingBlog } = await supabase
    .from('blogs')
    .select('author_id, cover_image_path')
    .eq('id', id)
    .single();

  if (!existingBlog) {
    throw new Error('Blog not found');
  }

  if (existingBlog.author_id !== user.id) {
    throw new Error('You can only delete your own blogs');
  }

  // Delete image from storage if it exists
  if (existingBlog.cover_image_path) {
    try {
      await supabase.storage
        .from('Blogs')
        .remove([existingBlog.cover_image_path]);
    } catch (imageError) {
      console.error('Failed to delete image from storage:', imageError);
    }
  }

  // Delete blog
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete blog: ${error.message}`);
  }
}

// Delete blog image
export async function deleteBlogImage(id: string): Promise<Blog> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User must be authenticated to delete blog images');
  }

  // Check if user is the author
  const { data: existingBlog } = await supabase
    .from('blogs')
    .select('author_id, cover_image_path')
    .eq('id', id)
    .single();

  if (!existingBlog) {
    throw new Error('Blog not found');
  }

  if (existingBlog.author_id !== user.id) {
    throw new Error('You can only update your own blogs');
  }

  // Delete image from storage if it exists
  if (existingBlog.cover_image_path) {
    try {
      await supabase.storage
        .from('Blogs')
        .remove([existingBlog.cover_image_path]);
    } catch (imageError) {
      console.error('Failed to delete image from storage:', imageError);
    }
  }

  // Update blog to remove image references
  const { data: blog, error } = await supabase
    .from('blogs')
    .update({
      cover_image_url: null,
      cover_image_path: null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  return blog;
}
