import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/Button';
import { Footer } from '../../components/Layout/Footer';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { user, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, formData.companyName);
      toast.success('Account created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start managing your business today
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer for auth pages */}
      <Footer />
    </div>
  );
};