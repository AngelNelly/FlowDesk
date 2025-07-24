interface DBSchema {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  sales: Sale[];
  appointments: Appointment[];
}

class FlowdeskDB {
  private db: IDBDatabase | null = null;
  private dbName = 'FlowdeskDB';
  private version = 1;

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
        
        // Create object stores
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customers')) {
          db.createObjectStore('customers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('invoices')) {
          db.createObjectStore('invoices', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sales')) {
          db.createObjectStore('sales', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('appointments')) {
          db.createObjectStore('appointments', { keyPath: 'id' });
        }
      };
    });
  }

  async save<T>(storeName: string, data: T[]): Promise<void> {
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

  async load<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const flowdeskDB = new FlowdeskDB();