import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  PencilSquareIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import blogsAPI from '../services/blogsAPI';

// Utility function to generate slug from title
const generateSlug = (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  // Add timestamp to make it unique
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `${baseSlug}-${timestamp}`;
};

interface BlogFormData {
  title: string;
  content: string;
  tags: string;
  coverImage?: File;
}

export default function AdminAddBlog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<BlogFormData>();

  const watchedTitle = watch('title');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Starting blog creation process...');
      console.log('📝 Form data:', data);
      
      // Generate slug from title
      const slug = generateSlug(data.title);
      console.log('🔗 Generated slug:', slug);
      
      // Prepare blog data
      const blogData = {
        title: data.title,
        content: data.content,
        slug: slug,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        published: true,
        created_at: new Date().toISOString()
      };
      
      console.log('📦 Blog data to send:', blogData);
      
      // Create blog via API
      console.log('🌐 Making API call to create blog...');
      const response = await blogsAPI.createBlog(blogData);
      console.log('✅ API response:', response);
      
      // Handle image upload if present
      if (coverImage) {
        console.log('🖼️ Uploading cover image...');
        const formData = new FormData();
        formData.append('image', coverImage);
        formData.append('blogId', response.blog.id.toString());
        
        const imageResponse = await blogsAPI.uploadBlogImage(formData);
        console.log('✅ Image upload response:', imageResponse);
      }
      
      toast.success('Blog post created successfully!');
      console.log('🎉 Blog creation completed successfully');
      
      // Reset form
      reset();
      setCoverImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Redirect to manage blogs
      setTimeout(() => {
        navigate('/admin/manage-blogs');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error creating blog:', error);
      toast.error('Failed to create blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PencilSquareIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-serif font-semibold text-academic-900">
              Add New Blog Post
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/manage-blogs')}
            className="flex items-center text-academic-600 hover:text-academic-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Blogs
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-academic-700 mb-2">
              Title *
            </label>
            <input
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              })}
              type="text"
              id="title"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-500' : 'border-academic-300'
              }`}
              placeholder="Enter blog post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.title.message}
              </p>
            )}
            {watchedTitle && (
              <p className="mt-1 text-sm text-academic-500">
                Slug: {generateSlug(watchedTitle)}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-academic-700 mb-2">
              Content *
            </label>
            <textarea
              {...register('content', { 
                required: 'Content is required',
                minLength: { value: 10, message: 'Content must be at least 10 characters' }
              })}
              id="content"
              rows={12}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.content ? 'border-red-500' : 'border-academic-300'
              }`}
              placeholder="Write your blog post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-academic-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              {...register('tags')}
              type="text"
              id="tags"
              className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="research, academic, technology"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-academic-700 mb-2">
              Cover Image
            </label>
            <div 
              className="border-2 border-dashed border-academic-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {coverImage ? (
                <div className="space-y-2">
                  <PhotoIcon className="h-12 w-12 text-primary-600 mx-auto" />
                  <p className="text-academic-600">{coverImage.name}</p>
                  <p className="text-sm text-academic-500">
                    {(coverImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <PhotoIcon className="h-12 w-12 text-academic-400 mx-auto mb-4" />
                  <p className="text-academic-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-academic-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="coverImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-blogs')}
              className="px-6 py-3 border border-academic-300 text-academic-700 rounded-lg hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Create Blog Post
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}