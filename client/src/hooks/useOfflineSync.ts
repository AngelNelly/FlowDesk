import { useState, useEffect } from 'react';

interface SyncStatus {
  isOnline: boolean;
  pendingSync: number;
  lastSync: Date | null;
}

export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingSync: 0,
    lastSync: null
  });

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      syncPendingData();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    try {
      const pendingData = localStorage.getItem('pendingSync');
      if (pendingData) {
        // Process pending data
        localStorage.removeItem('pendingSync');
        setSyncStatus(prev => ({ 
          ...prev, 
          pendingSync: 0, 
          lastSync: new Date() 
        }));
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const addToPendingSync = (data: any) => {
    const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    pending.push({ ...data, timestamp: new Date() });
    localStorage.setItem('pendingSync', JSON.stringify(pending));
    setSyncStatus(prev => ({ ...prev, pendingSync: pending.length }));
  };

  return { syncStatus, addToPendingSync };
};