import React, { useState } from 'react';
import { Plus, Search, FileText, Download, Eye, Edit, Trash2, Send, Mail } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceViewer } from './InvoiceViewer';
import { formatCurrency, formatDate } from '../../utils/storage';
import { sendInvoiceEmail, sendInvoiceReminder } from '../../utils/email';
import { Invoice } from '../../types';
import toast from 'react-hot-toast';

export const Invoices: React.FC = () => {
  const { invoices, customers, deleteInvoice, businessSettings } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid').length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Get overdue invoices
  const overdueInvoices = invoices.filter(invoice => 
    invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date()
  );

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleView = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setIsViewerOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewingInvoice(null);
  };

  const handleDelete = (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      deleteInvoice(invoice.id);
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId);
    if (!customer?.email) {
      toast.error('Customer email not found');
      return;
    }

    setSendingEmails(prev => new Set(prev).add(invoice.id));
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
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoice.id);
        return newSet;
      });
    }
  };

  const handleSendReminder = async (invoice: Invoice) => {
    const customer = customers.find(c => c.id === invoice.customerId);
    if (!customer?.email) {
      toast.error('Customer email not found');
      return;
    }

    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    const reminderType = daysOverdue > 7 ? 'urgent' : 'gentle';

    setSendingEmails(prev => new Set(prev).add(invoice.id));
    try {
      const success = await sendInvoiceReminder(invoice, customer.email, businessSettings, reminderType);
      if (success) {
        toast.success(`Payment reminder sent to ${customer.email}`);
      } else {
        toast.error('Failed to send reminder');
      }
    } catch (error) {
      toast.error('Reminder sending failed');
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoice.id);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (invoice: Invoice) => {
    return invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and manage your invoices with email capabilities.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-gray-900">{unpaidInvoices}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalAmount, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-900">Overdue Invoices</h3>
                <p className="text-red-700">
                  {overdueInvoices.length} invoice{overdueInvoices.length > 1 ? 's are' : ' is'} overdue and need{overdueInvoices.length === 1 ? 's' : ''} attention
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                overdueInvoices.forEach(invoice => {
                  const customer = customers.find(c => c.id === invoice.customerId);
                  if (customer?.email) {
                    handleSendReminder(invoice);
                  }
                });
              }}
            >
              Send All Reminders
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card padding={false}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => {
                const customer = customers.find(c => c.id === invoice.customerId);
                const overdue = isOverdue(invoice);
                const isSending = sendingEmails.has(invoice.id);
                
                return (
                  <tr key={invoice.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${overdue ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                      {overdue && (
                        <span className="ml-2 text-xs text-red-600 font-medium">OVERDUE</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{invoice.customerName}</div>
                        {customer?.email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span className={overdue ? 'text-red-600 font-medium' : ''}>
                        {formatDate(invoice.dueDate)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(invoice.total, businessSettings.currency)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleView(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {customer?.email && (
                          <>
                            <button
                              onClick={() => handleSendEmail(invoice)}
                              disabled={isSending}
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                              title="Email Invoice"
                            >
                              <Send className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
                            </button>
                            {overdue && (
                              <button
                                onClick={() => handleSendReminder(invoice)}
                                disabled={isSending}
                                className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                                title="Send Payment Reminder"
                              >
                                <Mail className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(invoice)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter ? 'Try adjusting your filters.' : 'Get started by creating your first invoice.'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Create/Edit Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Invoice Viewer Modal */}
      <Modal
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        title={`Invoice ${viewingInvoice?.invoiceNumber}`}
        size="xl"
      >
        {viewingInvoice && (
          <InvoiceViewer
            invoice={viewingInvoice}
            onClose={handleCloseViewer}
          />
        )}
      </Modal>
    </div>
  );
};