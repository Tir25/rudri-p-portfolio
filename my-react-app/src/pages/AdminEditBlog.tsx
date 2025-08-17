import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getBlog, updateBlog, deleteBlogImage, type UpdateBlogData, type Blog } from '../services/supabaseBlogService';

export default function AdminEditBlog() {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<UpdateBlogData>({
    title: '',
    content: '',
    slug: '',
    tags: [],
    published: true
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBlog = useCallback(async () => {
    try {
      setLoading(true);
      const blogData = await getBlog(blogId!);
      if (!blogData) {
        setError('Blog not found');
        return;
      }
      setBlog(blogData);
      setFormData({
        title: blogData.title,
        content: blogData.content,
        slug: blogData.slug,
        tags: blogData.tags,
        published: blogData.published
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (blogId) {
      loadBlog();
    }
  }, [blogId, loadBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleRemoveImage = async () => {
    if (!blog) return;

    try {
      const updatedBlog = await deleteBlogImage(blog.id);
      setBlog(updatedBlog);
      setSuccess('Cover image removed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: UpdateBlogData = {
        ...formData,
        cover_image: coverImage || undefined
      };

      const updatedBlog = await updateBlog(blog.id, updateData);
      setBlog(updatedBlog);
      setSuccess('Blog updated successfully!');
      setCoverImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('cover-image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Edit Blog</h1>
          <p className="text-academic-600">Loading blog data...</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-academic-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-academic-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Edit Blog</h1>
          <p className="text-academic-600">Blog not found</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-academic-600">The blog you're looking for doesn't exist or you don't have permission to edit it.</p>
          <button
            onClick={() => navigate('/admin/manage-blogs')}
            className="mt-4 px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500"
          >
            Back to Manage Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-academic-900">Edit Blog</h1>
          <p className="text-academic-600">Update your blog post</p>
        </div>
        <button
          onClick={() => navigate('/admin/manage-blogs')}
          className="px-4 py-2 border border-academic-300 text-academic-700 rounded-md hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-academic-500"
        >
          Back to Manage Blogs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-academic-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-academic-700 mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
            placeholder="blog-post-url-slug"
          />
          <p className="text-sm text-academic-500 mt-1">
            Leave empty to auto-generate from title
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-academic-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
            placeholder="Write your blog content here..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-academic-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-sm text-academic-500 mt-1">
            Separate tags with commas
          </p>
        </div>

        <div>
          <label htmlFor="cover-image" className="block text-sm font-medium text-academic-700 mb-2">
            Cover Image
          </label>
          {blog.cover_image_url && (
            <div className="mb-4">
              <img
                src={blog.cover_image_url}
                alt="Current cover image"
                className="h-32 w-auto rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Remove current image
              </button>
            </div>
          )}
          <input
            type="file"
            id="cover-image"
            name="cover-image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
          />
          <p className="text-sm text-academic-500 mt-1">
            {blog.cover_image_url ? 'Upload a new image to replace the current one' : 'Upload a cover image for your blog post'}
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="h-4 w-4 text-academic-600 focus:ring-academic-500 border-academic-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-academic-700">
            Publish this blog
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/manage-blogs')}
            className="px-4 py-2 border border-academic-300 text-academic-700 rounded-md hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-academic-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Blog Post'}
          </button>
        </div>
      </form>

      <div className="bg-academic-50 border border-academic-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-academic-900 mb-2">Blog Information</h3>
        <p className="text-academic-600">Blog ID: {blog.id}</p>
        <p className="text-academic-600">Created: {new Date(blog.created_at).toLocaleDateString()}</p>
        <p className="text-academic-600">Last Updated: {new Date(blog.updated_at).toLocaleDateString()}</p>
        <p className="text-academic-600">Author ID: {blog.author_id}</p>
      </div>
    </div>
  );
}