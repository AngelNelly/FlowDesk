import { User, Product, Customer, Invoice, Sale, Appointment, BusinessSettings } from '../types';

// User storage
export const getUserFromStorage = (): User | null => {
  try {
    const user = localStorage.getItem('flowdesk_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const saveUserToStorage = (user: User): void => {
  localStorage.setItem('flowdesk_user', JSON.stringify(user));
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem('flowdesk_user');
};

// Products storage
export const getProductsFromStorage = (): Product[] => {
  try {
    const products = localStorage.getItem('flowdesk_products');
    return products ? JSON.parse(products) : [];
  } catch {
    return [];
  }
};

export const saveProductsToStorage = (products: Product[]): void => {
  localStorage.setItem('flowdesk_products', JSON.stringify(products));
};

// Customers storage
export const getCustomersFromStorage = (): Customer[] => {
  try {
    const customers = localStorage.getItem('flowdesk_customers');
    return customers ? JSON.parse(customers) : [];
  } catch {
    return [];
  }
};

export const saveCustomersToStorage = (customers: Customer[]): void => {
  localStorage.setItem('flowdesk_customers', JSON.stringify(customers));
};

// Invoices storage
export const getInvoicesFromStorage = (): Invoice[] => {
  try {
    const invoices = localStorage.getItem('flowdesk_invoices');
    return invoices ? JSON.parse(invoices) : [];
  } catch {
    return [];
  }
};

export const saveInvoicesToStorage = (invoices: Invoice[]): void => {
  localStorage.setItem('flowdesk_invoices', JSON.stringify(invoices));
};

// Sales storage
export const getSalesFromStorage = (): Sale[] => {
  try {
    const sales = localStorage.getItem('flowdesk_sales');
    return sales ? JSON.parse(sales) : [];
  } catch {
    return [];
  }
};

export const saveSalesToStorage = (sales: Sale[]): void => {
  localStorage.setItem('flowdesk_sales', JSON.stringify(sales));
};

// Appointments storage
export const getAppointmentsFromStorage = (): Appointment[] => {
  try {
    const appointments = localStorage.getItem('flowdesk_appointments');
    return appointments ? JSON.parse(appointments) : [];
  } catch {
    return [];
  }
};

export const saveAppointmentsToStorage = (appointments: Appointment[]): void => {
  localStorage.setItem('flowdesk_appointments', JSON.stringify(appointments));
};

// Business settings storage
export const getBusinessSettingsFromStorage = (): BusinessSettings | null => {
  try {
    const settings = localStorage.getItem('flowdesk_business_settings');
    return settings ? JSON.parse(settings) : null;
  } catch {
    return null;
  }
};

export const saveBusinessSettingsToStorage = (settings: BusinessSettings): void => {
  localStorage.setItem('flowdesk_business_settings', JSON.stringify(settings));
};

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV${year}${month}${random}`;
};