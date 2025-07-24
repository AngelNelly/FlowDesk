import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flowdesk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if not using demo credentials
    if (error.response?.status === 401 && !localStorage.getItem('flowdesk_token')?.startsWith('demo-token')) {
      localStorage.removeItem('flowdesk_token');
      localStorage.removeItem('flowdesk_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessType: string;
    phone: string;
  }) => api.post('/auth/register', userData),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: any) => api.put('/auth/updatedetails', data),
  
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/auth/updatepassword', data),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgotpassword', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/resetpassword/${token}`, { password }),
  
  logout: () => api.get('/auth/logout'),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  
  getById: (id: string) => api.get(`/products/${id}`),
  
  create: (data: any) => api.post('/products', data),
  
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  
  delete: (id: string) => api.delete(`/products/${id}`),
  
  getCategories: () => api.get('/products/categories'),
  
  updateStock: (id: string, quantity: number, operation: 'add' | 'subtract') =>
    api.put(`/products/${id}/stock`, { quantity, operation }),
  
  getLowStock: () => api.get('/products/low-stock'),
};

// Customers API
export const customersAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Invoices API
export const invoicesAPI = {
  getAll: (params?: any) => api.get('/invoices', { params }),
  getById: (id: string) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
  delete: (id: string) => api.delete(`/invoices/${id}`),
  sendEmail: (id: string) => api.post(`/invoices/${id}/send`),
  markAsPaid: (id: string, amount?: number) => api.put(`/invoices/${id}/pay`, { amount }),
};

// Sales API
export const salesAPI = {
  getAll: (params?: any) => api.get('/sales', { params }),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales', data),
  update: (id: string, data: any) => api.put(`/sales/${id}`, data),
  delete: (id: string) => api.delete(`/sales/${id}`),
  getAnalytics: (params?: any) => api.get('/sales/analytics', { params }),
};

// Appointments API
export const appointmentsAPI = {
  getAll: (params?: any) => api.get('/appointments', { params }),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/appointments/${id}/status`, { status }),
};

// Expenses API
export const expensesAPI = {
  getAll: (params?: any) => api.get('/expenses', { params }),
  getById: (id: string) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post('/expenses', data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get('/expenses/categories'),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: (params?: any) => api.get('/dashboard/metrics', { params }),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getChartData: (type: string, params?: any) => api.get(`/dashboard/charts/${type}`, { params }),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (params: any) => api.get('/reports/sales', { params }),
  getInventoryReport: (params: any) => api.get('/reports/inventory', { params }),
  getCustomerReport: (params: any) => api.get('/reports/customers', { params }),
  getFinancialReport: (params: any) => api.get('/reports/financial', { params }),
  exportReport: (type: string, format: string, params: any) =>
    api.get(`/reports/${type}/export/${format}`, { params, responseType: 'blob' }),
};

export default api;