import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function AdminDashboard() {
  const { user, isOwner, isAdmin } = useSupabaseAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Admin Dashboard</h1>
        <p className="text-academic-600">Welcome to the administrative panel</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-academic-900 mb-4">User Information</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {isOwner ? 'Owner' : isAdmin ? 'Admin' : 'User'}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-academic-900 mb-2">Blog Management</h3>
          <p className="text-academic-600 mb-4">Manage blog posts and content</p>
          <a href="/admin/manage-blogs" className="text-primary-600 hover:text-primary-700">
            Manage Blogs →
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-academic-900 mb-2">Research Papers</h3>
          <p className="text-academic-600 mb-4">Upload and manage research papers</p>
          <a href="/admin/manage-papers" className="text-primary-600 hover:text-primary-700">
            Manage Papers →
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-academic-900 mb-2">Profile</h3>
          <p className="text-academic-600 mb-4">Update your profile information</p>
          <a href="/admin/profile" className="text-primary-600 hover:text-primary-700">
            Edit Profile →
          </a>
        </div>
      </div>
    </div>
  );
}