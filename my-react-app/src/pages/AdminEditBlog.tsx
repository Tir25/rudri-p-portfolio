import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  TagIcon, 
  PhotoIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAuthContext } from '../context/AuthContext';
import blogsAPI from '../services/blogsAPI';

// Types
interface BlogFormValues {
  title: string;
  content: string;
  tags: string;
  published: boolean;
}

interface BlogData {
  id: number;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminEditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BlogFormValues>({
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      published: true
    }
  });

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id || !user) return;
      
      try {
        setIsLoading(true);
        console.log('🔍 Fetching blog with ID:', id);
        
        // Fetch real blog data from API
        const response = await blogsAPI.getBlogById(id);
        console.log('✅ Blog data received:', response);
        
        if (response) {
          setBlogData(response);
          
          // Set form values
          setValue('title', response.title);
          setValue('content', response.content || '');
          setValue('tags', response.tags ? response.tags.join(', ') : '');
          setValue('published', response.published);
          
          console.log('✅ Form populated with blog data');
        } else {
          console.error('❌ Blog not found');
          toast.error('Blog not found');
          navigate('/admin/manage-blogs');
        }
        
      } catch (error) {
        console.error('❌ Error fetching blog post:', error);
        toast.error('Failed to load blog post');
        navigate('/admin/manage-blogs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, user, setValue, navigate]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsImageRemoved(false);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear image
  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Submit form
  const onSubmit = async (data: BlogFormValues) => {
    if (!user || !id) {
      toast.error('You must be logged in to update a blog post');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('🚀 Starting blog update process...');
      console.log('📝 Form data:', data);
      console.log('🆔 Blog ID:', id);
      
      // Generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      console.log('🔗 Generated slug:', slug);
      
      // Prepare blog data
      const blogData = {
        title: data.title,
        content: data.content,
        slug: slug,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        published: data.published,
        updated_at: new Date().toISOString()
      };
      
      console.log('📦 Blog data to send:', blogData);
      
      // Update blog via API
      console.log('🌐 Making API call to update blog...');
      const response = await blogsAPI.updateBlog(id!, blogData);
      console.log('✅ API response:', response);
      
      // Handle image upload if new image is selected
      if (imageFile) {
        console.log('🖼️ Uploading new cover image...');
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('blogId', id);
        
        const imageResponse = await blogsAPI.uploadBlogImage(formData);
        console.log('✅ Image upload response:', imageResponse);
      }
      
      toast.success('Blog post updated successfully!');
      console.log('🎉 Blog update completed successfully');
      
      // Navigate to blog management
      setTimeout(() => {
        navigate('/admin/manage-blogs');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error updating blog:', error);
      toast.error('Failed to update blog post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-academic-lg p-8 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-academic-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-academic-lg border border-academic-100">
      <div className="px-6 py-8">
        <div className="flex items-center mb-6 border-b border-academic-100 pb-3">
          <button
            type="button"
            onClick={() => navigate('/admin/manage-blogs')}
            className="mr-4 p-2 rounded-full hover:bg-academic-100 transition-all duration-200"
            aria-label="Back to blog list"
          >
            <ArrowLeftIcon className="h-5 w-5 text-academic-600" />
          </button>
          <h2 className="text-2xl font-serif font-semibold text-academic-900">Edit Blog Post</h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-academic-700 mb-1">
              Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-academic-400" />
              </div>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className={`pl-10 block w-full border ${errors.title ? 'border-red-300' : 'border-academic-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200`}
                placeholder="Enter blog post title"
              />
              {errors.title && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-academic-700 mb-1">
              Tags (comma separated)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-academic-400" />
              </div>
              <input
                type="text"
                id="tags"
                {...register('tags')}
                className="pl-10 block w-full border border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
                placeholder="academic, research, digital-humanities"
              />
            </div>
            <p className="mt-1 text-xs text-academic-500">Separate tags with commas</p>
          </div>
          
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-academic-700 mb-1">
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-academic-200 border-dashed rounded-md bg-academic-50 transition-colors duration-200 hover:border-primary-300 hover:bg-academic-100">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Cover preview" 
                      className="mx-auto h-48 object-cover rounded shadow-academic"
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200 shadow-md"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-academic-400" />
                )}
                <div className="flex text-sm text-academic-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                    <span>{existingImageUrl ? 'Replace image' : 'Upload a file'}</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file"
                      ref={fileInputRef}
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-academic-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>
          
          {/* Content Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-academic-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              {...register('content', { required: 'Content is required' })}
              className="w-full px-4 py-2 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Write your blog post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          
          {/* Published Status */}
          <div className="flex items-center bg-academic-50 p-3 rounded-lg">
            <input
              id="published"
              type="checkbox"
              {...register('published')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-academic-300 rounded transition-colors duration-200"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-academic-700">
              Published
            </label>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end pt-4 border-t border-academic-100">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-blogs')}
              className="mr-4 px-4 py-2 border border-academic-300 rounded-md shadow-sm text-sm font-medium text-academic-700 bg-white hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}