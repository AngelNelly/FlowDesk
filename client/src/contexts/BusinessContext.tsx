import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Customer, Invoice, Sale, Appointment, BusinessSettings, DashboardMetrics } from '../types';
import { 
  getProductsFromStorage, 
  saveProductsToStorage,
  getCustomersFromStorage,
  saveCustomersToStorage,
  getInvoicesFromStorage,
  saveInvoicesToStorage,
  getSalesFromStorage,
  saveSalesToStorage,
  getAppointmentsFromStorage,
  saveAppointmentsToStorage,
  getBusinessSettingsFromStorage,
  saveBusinessSettingsToStorage
} from '../utils/storage';

interface BusinessContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Settings
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  
  // Metrics
  getDashboardMetrics: () => DashboardMetrics;
  
  // Real-time daily sales
  getTodaysSales: () => { total: number; transactions: number; sales: Sale[] };
  getYesterdaysSales: () => { total: number; transactions: number; sales: Sale[] };
  getDailySalesComparison: () => { 
    today: number; 
    yesterday: number; 
    change: number; 
    todayTransactions: number;
    yesterdayTransactions: number;
  };
  
  // Real-time updates trigger
  lastSaleUpdate: number;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastSaleUpdate, setLastSaleUpdate] = useState<number>(Date.now());
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: 'My Business',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    currency: 'NGN',
    taxRate: 7.5,
    invoiceTemplate: 'standard'
  });

  useEffect(() => {
    // Load data from storage
    const savedProducts = getProductsFromStorage();
    const savedCustomers = getCustomersFromStorage();
    const savedInvoices = getInvoicesFromStorage();
    const savedSales = getSalesFromStorage();
    const savedAppointments = getAppointmentsFromStorage();
    const savedSettings = getBusinessSettingsFromStorage();

    if (savedProducts.length > 0) setProducts(savedProducts);
    if (savedCustomers.length > 0) setCustomers(savedCustomers);
    if (savedInvoices.length > 0) setInvoices(savedInvoices);
    if (savedSales.length > 0) setSales(savedSales);
    if (savedAppointments.length > 0) setAppointments(savedAppointments);
    if (savedSettings) setBusinessSettings(savedSettings);

    // Load mock data if no data exists
    if (savedProducts.length === 0) {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Laptop Computer',
          sku: 'LAP001',
          category: 'Electronics',
          costPrice: 800000,
          sellingPrice: 1200000,
          stock: 15,
          minStock: 5,
          description: 'High-performance laptop',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Office Chair',
          sku: 'CHR001',
          category: 'Furniture',
          costPrice: 150000,
          sellingPrice: 250000,
          stock: 3,
          minStock: 5,
          description: 'Ergonomic office chair',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Wireless Mouse',
          sku: 'MOU001',
          category: 'Electronics',
          costPrice: 15000,
          sellingPrice: 25000,
          stock: 50,
          minStock: 10,
          description: 'Wireless optical mouse',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setProducts(mockProducts);
      saveProductsToStorage(mockProducts);
    }

    // Load mock customers if none exist
    if (savedCustomers.length === 0) {
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+234 801 234 5678',
          address: '123 Lagos Street, Victoria Island',
          totalPurchases: 0,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+234 802 345 6789',
          address: '456 Abuja Road, Garki',
          totalPurchases: 0,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+234 803 456 7890',
          address: '789 Port Harcourt Avenue, GRA',
          totalPurchases: 0,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
      setCustomers(mockCustomers);
      saveCustomersToStorage(mockCustomers);
    }

    // Load mock sales if none exist
    if (savedSales.length === 0) {
      const mockSales: Sale[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          items: [
            {
              productId: '1',
              productName: 'Laptop Computer',
              quantity: 1,
              unitPrice: 1200000,
              total: 1200000
            }
          ],
          total: 1200000,
          paymentMethod: 'card',
          staffId: '1',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Jane Smith',
          items: [
            {
              productId: '2',
              productName: 'Office Chair',
              quantity: 2,
              unitPrice: 250000,
              total: 500000
            },
            {
              productId: '3',
              productName: 'Wireless Mouse',
              quantity: 3,
              unitPrice: 25000,
              total: 75000
            }
          ],
          total: 575000,
          paymentMethod: 'transfer',
          staffId: '1',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'Mike Johnson',
          items: [
            {
              productId: '3',
              productName: 'Wireless Mouse',
              quantity: 5,
              unitPrice: 25000,
              total: 125000
            }
          ],
          total: 125000,
          paymentMethod: 'cash',
          staffId: '1',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: '4',
          customerId: '1',
          customerName: 'John Doe',
          items: [
            {
              productId: '3',
              productName: 'Wireless Mouse',
              quantity: 2,
              unitPrice: 25000,
              total: 50000
            }
          ],
          total: 50000,
          paymentMethod: 'mobile',
          staffId: '1',
          createdAt: new Date() // Today
        }
      ];
      setSales(mockSales);
      saveSalesToStorage(mockSales);

      // Update customer total purchases
      const updatedCustomers = savedCustomers.length > 0 ? savedCustomers : mockCustomers;
      updatedCustomers.forEach(customer => {
        const customerSales = mockSales.filter(sale => sale.customerId === customer.id);
        const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.total, 0);
        const lastPurchase = customerSales.length > 0 
          ? new Date(Math.max(...customerSales.map(sale => new Date(sale.createdAt).getTime())))
          : undefined;
        
        customer.totalPurchases = totalPurchases;
        customer.lastPurchase = lastPurchase;
      });
      setCustomers(updatedCustomers);
      saveCustomersToStorage(updatedCustomers);
    }
  }, []);

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newProducts = [...products, product];
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, ...productData, updatedAt: new Date() } : p
    );
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  // Customers
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => {
    const customer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      totalPurchases: 0,
      createdAt: new Date()
    };
    const newCustomers = [...customers, customer];
    setCustomers(newCustomers);
    saveCustomersToStorage(newCustomers);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const newCustomers = customers.map(c => 
      c.id === id ? { ...c, ...customerData } : c
    );
    setCustomers(newCustomers);
    saveCustomersToStorage(newCustomers);
  };

  const deleteCustomer = (id: string) => {
    const newCustomers = customers.filter(c => c.id !== id);
    setCustomers(newCustomers);
    saveCustomersToStorage(newCustomers);
  };

  // Invoices
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const invoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const newInvoices = [...invoices, invoice];
    setInvoices(newInvoices);
    saveInvoicesToStorage(newInvoices);
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    const newInvoices = invoices.map(i => 
      i.id === id ? { ...i, ...invoiceData } : i
    );
    setInvoices(newInvoices);
    saveInvoicesToStorage(newInvoices);
  };

  const deleteInvoice = (id: string) => {
    const newInvoices = invoices.filter(i => i.id !== id);
    setInvoices(newInvoices);
    saveInvoicesToStorage(newInvoices);
  };

  // Sales
  const addSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const sale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const newSales = [...sales, sale];
    setSales(newSales);
    saveSalesToStorage(newSales);
    
    // Trigger real-time update
    setLastSaleUpdate(Date.now());

    // Update customer total purchases
    const customer = customers.find(c => c.id === sale.customerId);
    if (customer) {
      updateCustomer(customer.id, {
        totalPurchases: customer.totalPurchases + sale.total,
        lastPurchase: new Date()
      });
    }

    // Update product stock
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct(product.id, {
          stock: product.stock - item.quantity
        });
      }
    });
  };

  // Appointments
  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const appointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const newAppointments = [...appointments, appointment];
    setAppointments(newAppointments);
    saveAppointmentsToStorage(newAppointments);
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    const newAppointments = appointments.map(a => 
      a.id === id ? { ...a, ...appointmentData } : a
    );
    setAppointments(newAppointments);
    saveAppointmentsToStorage(newAppointments);
  };

  const deleteAppointment = (id: string) => {
    const newAppointments = appointments.filter(a => a.id !== id);
    setAppointments(newAppointments);
    saveAppointmentsToStorage(newAppointments);
  };

  // Settings
  const updateBusinessSettings = (settings: Partial<BusinessSettings>) => {
    const newSettings = { ...businessSettings, ...settings };
    setBusinessSettings(newSettings);
    saveBusinessSettingsToStorage(newSettings);
  };

  // Real-time daily sales functions
  const getTodaysSales = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= todayStart && saleDate < todayEnd;
    });
    
    const total = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      total,
      transactions: todaySales.length,
      sales: todaySales
    };
  };

  const getYesterdaysSales = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    
    const yesterdaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= yesterdayStart && saleDate < todayStart;
    });
    
    const total = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      total,
      transactions: yesterdaySales.length,
      sales: yesterdaySales
    };
  };

  const getDailySalesComparison = () => {
    const todaysData = getTodaysSales();
    const yesterdaysData = getYesterdaysSales();
    
    const change = yesterdaysData.total > 0 
      ? ((todaysData.total - yesterdaysData.total) / yesterdaysData.total) * 100 
      : todaysData.total > 0 ? 100 : 0;

    return {
      today: todaysData.total,
      yesterday: yesterdaysData.total,
      change,
      todayTransactions: todaysData.transactions,
      yesterdayTransactions: yesterdaysData.transactions
    };
  };

  // Metrics
  const getDashboardMetrics = (): DashboardMetrics => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Calculate total sales from last 30 days
    const recentSales = sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= thirtyDaysAgo && saleDate <= today;
    });
    const totalSales = recentSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calculate stock value
    const stockValue = products.reduce((sum, product) => sum + (product.costPrice * product.stock), 0);
    
    // Count low stock products
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    
    // Count overdue invoices
    const overdueInvoices = invoices.filter(i => 
      i.status !== 'paid' && new Date(i.dueDate) < today
    ).length;

    // Count upcoming appointments (next 7 days)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingAppointments = appointments.filter(a => 
      a.status === 'scheduled' && 
      new Date(a.date) >= today && 
      new Date(a.date) <= nextWeek
    ).length;

    return {
      totalSales,
      stockValue,
      invoicesCount: invoices.length,
      appointmentsCount: upcomingAppointments,
      lowStockProducts,
      overdueInvoices
    };
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    sales,
    addSale,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    businessSettings,
    updateBusinessSettings,
    getDashboardMetrics,
    getTodaysSales,
    getYesterdaysSales,
    getDailySalesComparison,
    lastSaleUpdate
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};