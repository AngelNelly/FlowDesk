import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Send } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Button } from '../../components/UI/Button';
import { Invoice, InvoiceItem } from '../../types';
import { generateInvoiceNumber, formatCurrency } from '../../utils/storage';
import { sendInvoiceEmail } from '../../utils/email';
import toast from 'react-hot-toast';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onClose: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onClose }) => {
  const { products, customers, addInvoice, updateInvoice, businessSettings } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendEmailOnCreate, setSendEmailOnCreate] = useState(true);
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(),
    customerId: invoice?.customerId || '',
    customerName: invoice?.customerName || '',
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: invoice?.notes || '',
    status: invoice?.status || 'unpaid'
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [{ productId: '', productName: '', quantity: 1, unitPrice: 0, total: 0 }]
  );

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

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (businessSettings.taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        items,
        subtotal,
        tax,
        total,
        dueDate: new Date(formData.dueDate)
      };

      let savedInvoice: Invoice;

      if (invoice) {
        updateInvoice(invoice.id, invoiceData);
        savedInvoice = { ...invoice, ...invoiceData };
        toast.success('Invoice updated successfully!');
      } else {
        const newInvoice = {
          ...invoiceData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        addInvoice(newInvoice);
        savedInvoice = newInvoice as Invoice;
        toast.success('Invoice created successfully!');
      }

      // Send email if enabled and customer has email
      if (sendEmailOnCreate && !invoice) {
        const customer = customers.find(c => c.id === formData.customerId);
        if (customer?.email) {
          await handleSendEmail(savedInvoice, customer.email);
        }
      }

      onClose();
    } catch (error) {
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (invoiceToSend: Invoice, customerEmail: string) => {
    setSendingEmail(true);
    try {
      const success = await sendInvoiceEmail(invoiceToSend, customerEmail, businessSettings);
      if (success) {
        toast.success(`Invoice emailed to ${customerEmail}`);
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      toast.error('Email sending failed');
    } finally {
      setSendingEmail(false);
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

  const selectedCustomer = customers.find(c => c.id === formData.customerId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

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
                {customer.name} {customer.email && `(${customer.email})`}
              </option>
            ))}
          </select>
          {selectedCustomer?.email && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              Email: {selectedCustomer.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Email Options */}
      {!invoice && selectedCustomer?.email && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmailOnCreate}
              onChange={(e) => setSendEmailOnCreate(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email invoice to customer automatically
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-7">
            Invoice will be sent to: {selectedCustomer.email}
          </p>
        </div>
      )}

      {/* Invoice Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
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
                      {product.name}
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

        {/* Invoice Totals */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium">{formatCurrency(subtotal, businessSettings.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax ({businessSettings.taxRate}%):</span>
              <span className="text-sm font-medium">{formatCurrency(tax, businessSettings.currency)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(total, businessSettings.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        
        {/* Send Email Button for existing invoices */}
        {invoice && selectedCustomer?.email && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSendEmail(invoice, selectedCustomer.email!)}
            loading={sendingEmail}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        )}
        
        <Button type="submit" loading={loading}>
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};