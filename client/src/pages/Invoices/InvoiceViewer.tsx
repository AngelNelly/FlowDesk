import React from 'react';
import { Download, Printer, Send, Mail } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/storage';
import { useBusiness } from '../../contexts/BusinessContext';
import { generateInvoicePDF } from '../../utils/pdf';
import { sendInvoiceEmail } from '../../utils/email';
import toast from 'react-hot-toast';

interface InvoiceViewerProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice, onClose }) => {
  const { businessSettings, customers } = useBusiness();
  const [sendingEmail, setSendingEmail] = React.useState(false);

  const customer = customers.find(c => c.id === invoice.customerId);

  const handleDownloadPDF = () => {
    generateInvoicePDF(invoice, businessSettings);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!customer?.email) {
      toast.error('Customer email not found');
      return;
    }

    setSendingEmail(true);
    try {
      const success = await sendInvoiceEmail(invoice, customer.email, businessSettings);
      if (success) {
        toast.success(`Invoice emailed to ${customer.email}`);
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      toast.error('Email sending failed');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          {customer?.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-1" />
              Customer Email: {customer.email}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          {customer?.email && (
            <Button 
              variant="outline" 
              onClick={handleSendEmail}
              loading={sendingEmail}
            >
              <Send className="w-4 h-4 mr-2" />
              Email to Customer
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="bg-white p-8 rounded-lg border print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{businessSettings.companyName}</h1>
            <p className="text-gray-600 mt-2">Business Management Solution</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
            <p className="text-gray-600 mt-1">#{invoice.invoiceNumber}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Invoice To:
            </h3>
            <p className="text-lg font-medium text-gray-900">{invoice.customerName}</p>
            {customer?.email && (
              <p className="text-sm text-gray-600 mt-1">
                <Mail className="w-4 h-4 inline mr-1" />
                {customer.email}
              </p>
            )}
            {customer?.phone && (
              <p className="text-sm text-gray-600">{customer.phone}</p>
            )}
            {customer?.address && (
              <p className="text-sm text-gray-600 mt-1">{customer.address}</p>
            )}
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div>
                <span className="text-sm text-gray-600">Invoice Date: </span>
                <span className="font-medium">{formatDate(invoice.createdAt)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Due Date: </span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status: </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-700">
                    {formatCurrency(item.unitPrice, businessSettings.currency)}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(item.total, businessSettings.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal, businessSettings.currency)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({businessSettings.taxRate}%):</span>
                <span className="font-medium">{formatCurrency(invoice.tax, businessSettings.currency)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(invoice.total, businessSettings.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Notes:
            </h3>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">Generated by Flowdesk - Business Management Solution</p>
          {customer?.email && (
            <p className="mt-2 text-xs text-blue-600">
              This invoice has been sent to {customer.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};