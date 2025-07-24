import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export const SyncStatusBar: React.FC = () => {
  const { syncStatus } = useOfflineSync();

  if (syncStatus.isOnline && syncStatus.pendingSync === 0) {
    return null; // Don't show when everything is synced
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 p-3 ${
      syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
    } text-white text-sm`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {syncStatus.isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span>
            {syncStatus.isOnline ? 'Online' : 'Offline'} 
            {syncStatus.pendingSync > 0 && ` • ${syncStatus.pendingSync} pending sync`}
          </span>
        </div>
        
        {syncStatus.isOnline && syncStatus.pendingSync > 0 && (
          <div className="flex items-center space-x-1">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing...</span>
          </div>
        )}
        
        {syncStatus.lastSync && (
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Last sync: {syncStatus.lastSync.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};