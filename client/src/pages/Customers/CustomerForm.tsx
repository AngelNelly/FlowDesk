import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Button } from '../../components/UI/Button';
import { Customer } from '../../types';
import toast from 'react-hot-toast';

interface CustomerFormProps {
  customer?: Customer | null;
  onClose: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onClose }) => {
  const { addCustomer, updateCustomer } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customer) {
        updateCustomer(customer.id, formData);
        toast.success('Customer updated successfully!');
      } else {
        addCustomer(formData);
        toast.success('Customer added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Customer Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter customer address"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {customer ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
};