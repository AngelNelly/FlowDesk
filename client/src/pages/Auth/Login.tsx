import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Building2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/Button';
import { Footer } from '../../components/Layout/Footer';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('demo@flowdesk.com');
  const [password, setPassword] = useState('password');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast.success('Welcome to Flowdesk!');
    } catch (error) {
      toast.error('Invalid credentials. Try demo@flowdesk.com / password');
    }
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
              Welcome to Flowdesk
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your complete business management solution
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full border border-gray-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Create new account
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>✨ Demo Credentials (Works Offline):</strong><br />
                Email: demo@flowdesk.com<br />
                Password: password<br />
                <span className="text-xs mt-1 block">
                  🚀 Try it now! No backend required - full demo experience
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer for auth pages */}
      <Footer />
    </div>
  );
};