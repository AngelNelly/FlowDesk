import React, { useState } from 'react';
import { Plus, Search, Users, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { CustomerForm } from './CustomerForm';
import { formatCurrency, formatDate } from '../../utils/storage';
import { Customer } from '../../types';

export const Customers: React.FC = () => {
  const { customers, deleteCustomer, businessSettings } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const totalCustomers = customers.length;
  const totalPurchases = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);
  const averagePurchase = totalCustomers > 0 ? totalPurchases / totalCustomers : 0;

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      deleteCustomer(customer.id);
    }
  };

  const topCustomers = customers
    .sort((a, b) => b.totalPurchases - a.totalPurchases)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalPurchases, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Purchase</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averagePurchase, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Top Customers and Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Customers</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search.' : 'Get started by adding your first customer.'}
                  </p>
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{customer.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            {customer.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="w-4 h-4 mr-1" />
                                {customer.email}
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-1" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Joined {formatDate(customer.createdAt)}
                            {customer.lastPurchase && (
                              <span> • Last purchase {formatDate(customer.lastPurchase)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {formatCurrency(customer.totalPurchases, businessSettings.currency)}
                          </p>
                          <p className="text-xs text-gray-500">Total purchases</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Top Customers */}
        <div>
          <Card>
            <CardHeader title="Top Customers" />
            <div className="space-y-3">
              {topCustomers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No customer data available</p>
              ) : (
                topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">
                          {customer.lastPurchase ? formatDate(customer.lastPurchase) : 'No purchases'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {formatCurrency(customer.totalPurchases, businessSettings.currency)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};