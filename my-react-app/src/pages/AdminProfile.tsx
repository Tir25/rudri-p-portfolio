import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function AdminProfile() {
  const { user, isOwner } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use real user data from context
  const [profile, setProfile] = useState({
    displayName: user?.displayName || user?.name || 'Admin User',
    email: user?.email || '',
    bio: 'Academic researcher specializing in modern literature with a focus on digital humanities and computational approaches to literary analysis.',
    title: 'Professor of Digital Humanities',
    institution: 'University of Technology',
    website: 'https://example.com',
    twitter: '@rudridave',
    avatarUrl: user?.photoURL || ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-academic-sm">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-serif font-semibold text-academic-900 mb-6">Your Profile</h2>
        
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-primary-600 font-serif">
                {profile.displayName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium text-academic-900">{profile.displayName}</h3>
            <p className="text-academic-600">{profile.email}</p>
            {isOwner && (
              <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Website Owner
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-academic-700">
                Name
              </label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={profile.displayName}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-academic-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm bg-academic-50 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-academic-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={profile.title}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-academic-700">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                value={profile.institution}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-academic-700">
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={profile.bio}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-academic-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={profile.website}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-academic-700">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                id="twitter"
                value={profile.twitter}
                onChange={handleChange}
                className="mt-1 block w-full border-academic-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-academic-300 rounded-md shadow-sm text-sm font-medium text-academic-700 bg-white hover:bg-academic-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}