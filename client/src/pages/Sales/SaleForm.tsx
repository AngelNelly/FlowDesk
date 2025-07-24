import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Button } from '../../components/UI/Button';
import { InvoiceItem } from '../../types';
import { formatCurrency } from '../../utils/storage';
import toast from 'react-hot-toast';

interface SaleFormProps {
  onClose: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ onClose }) => {
  const { products, customers, addSale, businessSettings } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'transfer' | 'mobile',
    staffId: '1' // Current user ID
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = product.sellingPrice;
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate stock availability
      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (product && product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }
      }

      const saleData = {
        ...formData,
        items,
        total
      };

      addSale(saleData);
      toast.success('Sale recorded successfully!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
            Customer
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
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Bank Transfer</option>
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>
      </div>

      {/* Sale Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Sale Items</h3>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input
                  type="text"
                  value={formatCurrency(item.total, businessSettings.currency)}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-600 hover:text-red-900"
                  disabled={items.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sale Total */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(total, businessSettings.currency)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Record Sale
        </Button>
      </div>
    </form>
  );
};