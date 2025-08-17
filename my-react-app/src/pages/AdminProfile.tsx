import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function AdminProfile() {
  const { user, isOwner } = useSupabaseAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Profile</h1>
        <p className="text-academic-600">Manage your account information</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-academic-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-academic-700">Email</label>
            <p className="mt-1 text-sm text-academic-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-academic-700">User ID</label>
            <p className="mt-1 text-sm text-academic-900">{user?.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-academic-700">Role</label>
            <p className="mt-1 text-sm text-academic-900">
              {isOwner ? 'Owner' : 'Administrator'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-academic-700">Account Created</label>
            <p className="mt-1 text-sm text-academic-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-academic-900 mb-4">Security</h2>
        <p className="text-academic-600 mb-4">
          Your account is secured with Supabase authentication. Password changes and other security settings 
          can be managed through your Supabase dashboard.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> For security reasons, password changes and account management 
            are handled through the Supabase authentication system.
          </p>
        </div>
      </div>
    </div>
  );
}