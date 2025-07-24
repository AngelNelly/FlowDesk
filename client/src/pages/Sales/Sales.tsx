import React, { useState } from 'react';
import { Plus, Search, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { SaleForm } from './SaleForm';
import { formatCurrency, formatDate } from '../../utils/storage';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Sales: React.FC = () => {
  const { sales, products, businessSettings } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter sales based on search and date
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const saleDate = new Date(sale.createdAt);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = saleDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Calculate metrics
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;
  const totalTransactions = filteredSales.length;

  // Generate daily sales data for the last 7 days
  const dailySalesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const daySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === date.toDateString();
    });
    
    const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
    const count = daySales.length;
    
    return {
      name: dayName,
      sales: total,
      transactions: count
    };
  });

  // Payment method breakdown
  const paymentMethodData = sales.reduce((acc, sale) => {
    const existing = acc.find(item => item.name === sale.paymentMethod);
    if (existing) {
      existing.value += sale.total;
      existing.count += 1;
    } else {
      acc.push({
        name: sale.paymentMethod,
        value: sale.total,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; count: number }>);

  // Top products
  const productSales = sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      const existing = acc.find(p => p.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.total;
      } else {
        acc.push({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          revenue: item.total
        });
      }
    });
    return acc;
  }, [] as Array<{ productId: string; productName: string; quantity: number; revenue: number }>);

  const topProducts = productSales
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your sales performance and analyze trends.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalSales, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Sale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageSale, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Daily Sales Trend" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' 
                      ? formatCurrency(Number(value), businessSettings.currency) 
                      : value,
                    name === 'sales' ? 'Sales' : 'Transactions'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Payment Methods" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value), businessSettings.currency), 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Products and Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Top Selling Products" />
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-600">{product.quantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(product.revenue, businessSettings.currency)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Sales" />
          <div className="space-y-3">
            {filteredSales.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales found</p>
            ) : (
              filteredSales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sale.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(sale.createdAt)} • {sale.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(sale.total, businessSettings.currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Sales History Table */}
      <Card padding={false}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sales History</h3>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSales.slice(-10).reverse().map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {sale.customerName}
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {sale.items.length > 1 ? (
                      <span>{sale.items.length} items</span>
                    ) : (
                      <span>{sale.items[0]?.productName}</span>
                    )}
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(sale.total, businessSettings.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No sales found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || dateFilter !== 'all' ? 'Try adjusting your filters.' : 'Get started by recording your first sale.'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Record Sale Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Sale"
        size="xl"
      >
        <SaleForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};