import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export default function AdminSyncPapers() {
  const { user } = useSupabaseAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-academic-900">Sync Papers</h1>
        <p className="text-academic-600">Synchronize papers with external sources</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-academic-600">
          Paper synchronization functionality will be implemented with Supabase database integration.
        </p>
        <p className="text-academic-600 mt-2">
          User: {user?.email}
        </p>
      </div>
    </div>
  );
}