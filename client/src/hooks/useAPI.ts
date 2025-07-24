import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

interface UseAPIOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAPI = <T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<T>>,
  options: UseAPIOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...args);
      const result = response.data;
      
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
};

// Specialized hooks for common patterns
export const useProducts = (params?: any) => {
  const { productsAPI } = require('../services/api');
  return useAPI(() => productsAPI.getAll(params), { immediate: true });
};

export const useCustomers = (params?: any) => {
  const { customersAPI } = require('../services/api');
  return useAPI(() => customersAPI.getAll(params), { immediate: true });
};

export const useInvoices = (params?: any) => {
  const { invoicesAPI } = require('../services/api');
  return useAPI(() => invoicesAPI.getAll(params), { immediate: true });
};

export const useSales = (params?: any) => {
  const { salesAPI } = require('../services/api');
  return useAPI(() => salesAPI.getAll(params), { immediate: true });
};

export const useAppointments = (params?: any) => {
  const { appointmentsAPI } = require('../services/api');
  return useAPI(() => appointmentsAPI.getAll(params), { immediate: true });
};

export const useDashboardMetrics = (params?: any) => {
  const { dashboardAPI } = require('../services/api');
  return useAPI(() => dashboardAPI.getMetrics(params), { immediate: true });
};