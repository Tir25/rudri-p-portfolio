import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { createBlog, type CreateBlogData } from '../services/supabaseBlogService';


export default function AdminAddBlog() {
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    content: '',
    slug: '',
    tags: [],
    published: true
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const blogData: CreateBlogData = {
        ...formData,
        cover_image: coverImage || undefined
      };

      const newBlog = await createBlog(blogData);
      setSuccess(`Blog "${newBlog.title}" created successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        slug: '',
        tags: [],
        published: true
      });
      setCoverImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('cover-image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Add New Blog Post</h1>
        <p className="text-academic-600">Create and publish a new blog post</p>
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
            Slug (optional)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
            placeholder="blog-post-url-slug (auto-generated if empty)"
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
          <input
            type="file"
            id="cover-image"
            name="cover-image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-transparent"
          />
          <p className="text-sm text-academic-500 mt-1">
            Upload a cover image for your blog post
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
            Publish immediately
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                content: '',
                slug: '',
                tags: [],
                published: true
              });
              setCoverImage(null);
              setError(null);
              setSuccess(null);
              const fileInput = document.getElementById('cover-image') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
            }}
            className="px-4 py-2 border border-academic-300 text-academic-700 rounded-md hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-academic-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-academic-600 text-white rounded-md hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-academic-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
          </button>
        </div>
      </form>

      <div className="bg-academic-50 border border-academic-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-academic-900 mb-2">Current User</h3>
        <p className="text-academic-600">Email: {user?.email}</p>
        <p className="text-academic-600">User ID: {user?.id}</p>
      </div>
    </div>
  );
}