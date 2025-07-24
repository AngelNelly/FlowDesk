import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Button } from '../../components/UI/Button';
import { Appointment } from '../../types';
import toast from 'react-hot-toast';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onClose: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose }) => {
  const { customers, addAppointment, updateAppointment } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: appointment?.customerId || '',
    customerName: appointment?.customerName || '',
    title: appointment?.title || '',
    description: appointment?.description || '',
    date: appointment?.date ? new Date(appointment.date).toISOString().slice(0, 16) : '',
    duration: appointment?.duration || 60,
    status: appointment?.status || 'scheduled'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        ...formData,
        date: new Date(formData.date)
      };

      if (appointment) {
        updateAppointment(appointment.id, appointmentData);
        toast.success('Appointment updated successfully!');
      } else {
        addAppointment(appointmentData);
        toast.success('Appointment scheduled successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
            Customer *
          </label>
          <select
            id="customer"
            value={formData.customerId}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Appointment Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter appointment title"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            required
            min="15"
            step="15"
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="60"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter appointment description (optional)"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {appointment ? 'Update Appointment' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  );
};