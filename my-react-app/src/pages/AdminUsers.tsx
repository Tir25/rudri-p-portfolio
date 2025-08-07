import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { addAdminUser, getAllAdminUsers, deactivateAdminUser } from '../utils/adminUsers';
import { ShieldCheckIcon, UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminUsers() {
  const { user, isOwner } = useAuthContext();
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New admin user form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Load all admin users
  useEffect(() => {
    const loadAdminUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching admin users...");
        const users = await getAllAdminUsers();
        console.log("Admin users fetched:", users);
        setAdminUsers(users);
        setError('');
      } catch (err) {
        console.error("Error loading admin users:", err);
        setError('Failed to load admin users: ' + ((err as Error).message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    loadAdminUsers();
  }, []);
  
  // Handle adding a new admin user
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setFormError('');
    setFormSuccess('');
    
    // Validate inputs
    if (!newEmail || !newPassword) {
      setFormError('Please provide both email and password');
      return;
    }
    
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Adding new admin user:", newEmail);
      
      // Add the new admin user
      await addAdminUser(
        newEmail, 
        newPassword, 
        user?.email || 'unknown', 
        { canEdit, canDelete }
      );
      
      console.log("Admin user added successfully");
      
      // Refresh the admin users list
      const updatedUsers = await getAllAdminUsers();
      setAdminUsers(updatedUsers);
      
      // Reset form
      setNewEmail('');
      setNewPassword('');
      setCanEdit(true);
      setCanDelete(false);
      setFormSuccess('Admin user added successfully!');
    } catch (err) {
      console.error("Error adding admin user:", err);
      setFormError((err as Error).message || 'Failed to add admin user');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deactivating an admin user
  const handleDeactivateAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to deactivate this admin user?')) {
      try {
        setLoading(true);
        await deactivateAdminUser(adminId, user?.email || 'unknown');
        
        // Refresh the admin users list
        const updatedUsers = await getAllAdminUsers();
        setAdminUsers(updatedUsers);
        
        setFormSuccess('Admin user deactivated successfully');
      } catch (err) {
        setError('Failed to deactivate admin user: ' + ((err as Error).message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("Current user isOwner:", isOwner);

  // Only owner can manage admin users
  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Access Denied</p>
          <p>Only the website owner can manage admin users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="h-8 w-8 text-primary-600 mr-2" />
        <h1 className="text-2xl font-bold text-academic-900">Manage Admin Users</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Add New Admin Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserPlusIcon className="h-5 w-5 mr-2 text-primary-600" />
          Add New Admin User
        </h2>
        
        {formError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
            <p>{formError}</p>
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded" role="alert">
            <p>{formSuccess}</p>
          </div>
        )}
        
        <form onSubmit={handleAddAdmin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-academic-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-academic-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-academic-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-academic-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-academic-700 mb-2">Permissions</h3>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="canEdit"
                className="mr-2"
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)}
              />
              <label htmlFor="canEdit" className="text-academic-700">Can Edit Content</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="canDelete"
                className="mr-2"
                checked={canDelete}
                onChange={(e) => setCanDelete(e.target.checked)}
              />
              <label htmlFor="canDelete" className="text-academic-700">Can Delete Content</label>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Admin User'}
          </button>
        </form>
      </div>
      
      {/* Admin Users List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Admin Users</h2>
        
        {loading && <p>Loading admin users...</p>}
        
        {!loading && adminUsers.length === 0 && (
          <p className="text-academic-600">No admin users found.</p>
        )}
        
        {!loading && adminUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-academic-200">
              <thead className="bg-academic-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Added By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-academic-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-academic-200">
                {adminUsers.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-900">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">{admin.addedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {admin.addedAt?.toDate ? admin.addedAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {admin.permissions?.canEdit && <span className="mr-2">Edit</span>}
                      {admin.permissions?.canDelete && <span>Delete</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {admin.isActive && (
                        <button
                          onClick={() => handleDeactivateAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}