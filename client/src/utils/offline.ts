// Offline functionality using IndexedDB
class OfflineManager {
  private dbName = 'FlowdeskOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for offline data
        const stores = ['products', 'customers', 'invoices', 'sales', 'appointments', 'pendingSync'];
        
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            if (storeName === 'pendingSync') {
              store.createIndex('timestamp', 'timestamp', { unique: false });
            }
          }
        });
      };
    });
  }

  async saveData(storeName: string, data: any[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Clear existing data
    await store.clear();
    
    // Add new data
    for (const item of data) {
      await store.add(item);
    }
  }

  async getData(storeName: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToPendingSync(action: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
    const store = transaction.objectStore('pendingSync');
    
    const syncItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date(),
      retries: 0
    };
    
    await store.add(syncItem);
  }

  async getPendingSync(): Promise<any[]> {
    return this.getData('pendingSync');
  }

  async removePendingSync(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
    const store = transaction.objectStore('pendingSync');
    await store.delete(id);
  }

  async syncPendingData(): Promise<void> {
    const pendingItems = await this.getPendingSync();
    
    for (const item of pendingItems) {
      try {
        // Process sync item based on action
        await this.processSyncItem(item);
        await this.removePendingSync(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        // Increment retry count
        item.retries += 1;
        if (item.retries >= 3) {
          // Remove after 3 failed attempts
          await this.removePendingSync(item.id);
        }
      }
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    const { action, data } = item;
    
    // Import API functions dynamically to avoid circular dependencies
    const api = await import('../services/api');
    
    switch (action) {
      case 'CREATE_PRODUCT':
        await api.productsAPI.create(data);
        break;
      case 'UPDATE_PRODUCT':
        await api.productsAPI.update(data.id, data);
        break;
      case 'DELETE_PRODUCT':
        await api.productsAPI.delete(data.id);
        break;
      case 'CREATE_SALE':
        await api.salesAPI.create(data);
        break;
      case 'CREATE_INVOICE':
        await api.invoicesAPI.create(data);
        break;
      case 'CREATE_CUSTOMER':
        await api.customersAPI.create(data);
        break;
      case 'CREATE_APPOINTMENT':
        await api.appointmentsAPI.create(data);
        break;
      default:
        console.warn('Unknown sync action:', action);
    }
  }
}

export const offlineManager = new OfflineManager();

// Service Worker registration for offline support
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Network status detection
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      offlineManager.syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};