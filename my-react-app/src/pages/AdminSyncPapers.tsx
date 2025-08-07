import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowPathIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SyncResult {
  type: 'success' | 'error' | 'info';
  message: string;
  count?: number;
}

export default function AdminSyncPapers() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResults([]);

    try {
      // TODO: Implement real paper synchronization
      // For now, show a message that this feature is not yet implemented
      setSyncResults([
        { type: 'info', message: 'Paper synchronization feature is not yet implemented.' },
        { type: 'info', message: 'This feature will be available in a future update.' }
      ]);
      toast.info('Paper synchronization feature coming soon');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync papers');
      setSyncResults([{ type: 'error', message: 'Synchronization failed' }]);
    } finally {
      setIsSyncing(false);
    }
  };

  const getIcon = (type: SyncResult['type']) => {
    switch (type) {
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
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
        <div className="flex items-center mb-6">
          <ArrowPathIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-serif font-semibold text-academic-900">
            Sync Research Papers
          </h1>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">About Paper Synchronization</h3>
            <p className="text-sm text-blue-700">
              This tool synchronizes your papers between the database and storage system. 
              It ensures all papers are properly indexed and accessible.
            </p>
          </div>

          {/* Sync Button */}
          <div className="text-center">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Start Sync'}
            </button>
          </div>

          {/* Sync Results */}
          {syncResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-academic-900">Sync Results</h3>
              <div className="space-y-2">
                {syncResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-academic-50 rounded-lg"
                  >
                    {getIcon(result.type)}
                    <span className="ml-3 text-sm text-academic-900">
                      {result.message}
                      {result.count && (
                        <span className="ml-2 text-xs text-academic-500">
                          ({result.count} items)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-academic-50 border border-academic-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-academic-800 mb-2">What happens during sync?</h3>
            <ul className="text-sm text-academic-700 space-y-1">
              <li>• Validates all paper files are accessible</li>
              <li>• Updates metadata and indexing</li>
              <li>• Removes orphaned files</li>
              <li>• Ensures database consistency</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}