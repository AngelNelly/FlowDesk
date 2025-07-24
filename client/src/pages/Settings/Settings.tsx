import React, { useState } from 'react';
import { Save, Upload, Palette, CreditCard, Users, Bell, Shield, Download, Mail, Sun, Moon, Monitor } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { EmailSettings } from './EmailSettings';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { businessSettings, updateBusinessSettings } = useBusiness();
  const { currentTheme, themes, setTheme, toggleMode, isDarkMode, customLogo, setCustomLogo } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: businessSettings.companyName || '',
    currency: businessSettings.currency || 'NGN',
    taxRate: businessSettings.taxRate || 7.5,
    address: businessSettings.address || '',
    phone: businessSettings.phone || '',
    email: businessSettings.email || ''
  });

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'email', name: 'Email Setup', icon: Mail },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const subscriptionTiers = [
    {
      name: 'Free',
      price: 0,
      currency: 'NGN',
      features: ['Up to 100 products', 'Up to 50 customers', 'Basic reports', 'Email support'],
      current: true
    },
    {
      name: 'Pro',
      price: 15000,
      currency: 'NGN',
      features: ['Unlimited products', 'Unlimited customers', 'Advanced reports', 'Priority support', 'Custom branding'],
      current: false,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 45000,
      currency: 'NGN',
      features: ['Everything in Pro', 'Multi-location support', 'API access', 'Dedicated support', 'Custom integrations'],
      current: false
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateBusinessSettings(formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomLogo(result);
        toast.success('Logo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const exportData = () => {
    const data = {
      businessSettings,
      exportDate: new Date().toISOString(),
      user: user?.name
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowdesk-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Company Information" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-white">
                Default Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="GHS">Ghanaian Cedi (₵)</option>
                <option value="KES">Kenyan Shilling (KSh)</option>
                <option value="ZAR">South African Rand (R)</option>
              </select>
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 dark:text-white">
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxRate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-white">
              Business Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
              placeholder="Enter your business address"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button type="button" variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Settings
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Dark/Light Mode Toggle */}
      <Card>
        <CardHeader title="Display Mode" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-yellow-500'}`}>
                {isDarkMode ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isDarkMode 
                    ? 'Switch to light mode for better visibility in bright environments'
                    : 'Switch to dark mode for reduced eye strain in low light'
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={toggleMode}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
              <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Light Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Clean and bright interface
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
              <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Easy on the eyes
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
              <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Auto Switch</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Logo Upload */}
      <Card>
        <CardHeader title="Company Logo" />
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {customLogo ? (
              <img src={customLogo} alt="Company Logo" className="w-16 h-16 object-contain border rounded-lg" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 border rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Logo</span>
              </div>
            )}
            <div>
              <label htmlFor="logo" className="cursor-pointer">
                <div className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </div>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="sr-only"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          {customLogo && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomLogo(null)}
            >
              Remove Logo
            </Button>
          )}
        </div>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader title="Color Themes" />
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choose from our collection of beautiful color themes. Each theme is available in both light and dark modes.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currentTheme.id === theme.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    {theme.mode === 'light' ? (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">{theme.name}</p>
                {currentTheme.id === theme.id && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Currently Active</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSubscriptionSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Subscription Plans" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-6 border-2 rounded-lg ${
                tier.current ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'
              } ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₦{tier.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 text-green-500">✓</div>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {tier.current ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full" variant={tier.popular ? 'primary' : 'outline'}>
                    {tier.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Billing Information" />
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white">Current Plan: Free</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Next billing date: Not applicable</p>
          </div>
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader 
          title="Team Members" 
          action={
            <Button size="sm">
              <Users className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          }
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Owner
            </span>
          </div>
          
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No team members added yet.</p>
            <p className="text-sm">Invite team members to collaborate on your business.</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Permissions & Roles" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Manager</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Can manage inventory, sales, and customers</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                <li>• View all sections</li>
                <li>• Add/edit products</li>
                <li>• Create invoices</li>
                <li>• Record sales</li>
              </ul>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Sales Staff</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Limited to sales and customer management</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                <li>• Record sales only</li>
                <li>• View customers</li>
                <li>• Basic reports</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader title="Notification Preferences" />
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get notified when products are running low</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Overdue Invoices</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get reminders for unpaid invoices</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Daily Sales Summary</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Receive daily sales reports via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Appointment Reminders</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get reminders for upcoming appointments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your business settings and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'business' && renderBusinessSettings()}
      {activeTab === 'appearance' && renderAppearanceSettings()}
      {activeTab === 'email' && <EmailSettings />}
      {activeTab === 'subscription' && renderSubscriptionSettings()}
      {activeTab === 'team' && renderTeamSettings()}
      {activeTab === 'notifications' && renderNotificationSettings()}
    </div>
  );
};