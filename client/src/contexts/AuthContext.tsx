import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, companyName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo user data
  const demoUser: User = {
    id: 'demo-user-1',
    email: 'demo@flowdesk.com',
    name: 'Demo User',
    role: 'owner',
    businessName: 'Demo Business',
    businessType: 'retail',
    phone: '+234 800 DEMO USER',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'en',
    subscription: {
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    settings: {
      theme: 'blue-light',
      notifications: {
        email: true,
        sms: false,
        push: true,
        lowStock: true,
        overdueInvoices: true,
        appointments: true
      },
      modules: {
        inventory: true,
        sales: true,
        invoices: true,
        customers: true,
        appointments: true,
        expenses: true
      }
    },
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  };

  useEffect(() => {
    const token = localStorage.getItem('flowdesk_token');
    const savedUser = localStorage.getItem('flowdesk_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('flowdesk_token');
        localStorage.removeItem('flowdesk_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check for demo credentials first
      if (email === 'demo@flowdesk.com' && password === 'password') {
        // Demo login - no API call needed
        const demoToken = 'demo-token-' + Date.now();
        localStorage.setItem('flowdesk_token', demoToken);
        localStorage.setItem('flowdesk_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }

      // Verify token and get user data
      const response = await authAPI.login(email, password);
      const { token, data } = response.data;
      
      localStorage.setItem('flowdesk_token', token);
      localStorage.setItem('flowdesk_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      // If API fails, check for demo credentials as fallback
      if (email === 'demo@flowdesk.com' && password === 'password') {
        const demoToken = 'demo-token-' + Date.now();
        localStorage.setItem('flowdesk_token', demoToken);
        localStorage.setItem('flowdesk_user', JSON.stringify(demoUser));
        setUser(demoUser);
      } else {
        throw new Error('Invalid credentials. Try demo@flowdesk.com / password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, companyName: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        businessName: companyName,
        businessType: 'retail',
        phone: '+234' // Default phone, should be collected in form
      });
      
      const { token, data } = response.data;
      
      localStorage.setItem('flowdesk_token', token);
      localStorage.setItem('flowdesk_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      // For demo purposes, allow any registration
      const newUser: User = {
        ...demoUser,
        id: 'user-' + Date.now(),
        email,
        name,
        businessName: companyName,
        createdAt: new Date()
      };
      
      const demoToken = 'demo-token-' + Date.now();
      localStorage.setItem('flowdesk_token', demoToken);
      localStorage.setItem('flowdesk_user', JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flowdesk_token');
    localStorage.removeItem('flowdesk_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};