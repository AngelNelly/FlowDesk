export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'staff';
  businessName: string;
  businessType: 'retail' | 'service' | 'hybrid';
  phone: string;
  currency: string;
  timezone: string;
  language: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd?: Date;
  };
  settings: {
    theme: string;
    notifications: any;
    modules: any;
  };
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  lastPurchase?: Date;
  createdAt: Date;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'unpaid' | 'partial';
  dueDate: Date;
  createdAt: Date;
  notes?: string;
}

export interface Sale {
  id: string;
  invoiceId?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mobile';
  createdAt: Date;
  staffId: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface BusinessSettings {
  companyName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  taxRate: number;
  invoiceTemplate: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface DashboardMetrics {
  totalSales: number;
  stockValue: number;
  invoicesCount: number;
  appointmentsCount: number;
  lowStockProducts: number;
  overdueInvoices: number;
}