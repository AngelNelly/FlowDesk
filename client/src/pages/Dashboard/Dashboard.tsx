import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  FileText, 
  Calendar,
  AlertTriangle,
  Plus,
  DollarSign,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { SaleForm } from '../Sales/SaleForm';
import { formatCurrency } from '../../utils/storage';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    getDashboardMetrics, 
    sales, 
    products, 
    businessSettings, 
    getTodaysSales, 
    getYesterdaysSales, 
    getDailySalesComparison,
    lastSaleUpdate 
  } = useBusiness();
  
  const [metrics, setMetrics] = useState(getDashboardMetrics());
  const [dailyComparison, setDailyComparison] = useState(getDailySalesComparison());
  const [todaysData, setTodaysData] = useState(getTodaysSales());
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

  // Update metrics in real-time when sales change
  useEffect(() => {
    setMetrics(getDashboardMetrics());
    setDailyComparison(getDailySalesComparison());
    setTodaysData(getTodaysSales());
  }, [lastSaleUpdate, sales, getDashboardMetrics, getDailySalesComparison, getTodaysSales]);

  // Auto-refresh every 30 seconds to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getDashboardMetrics());
      setDailyComparison(getDailySalesComparison());
      setTodaysData(getTodaysSales());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [getDashboardMetrics, getDailySalesComparison, getTodaysSales]);

  // Generate sales data for the last 7 days
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const daySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate.toDateString() === date.toDateString();
    });
    
    const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      name: dayName,
      sales: total
    };
  });

  // Category breakdown for pie chart
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.stock * product.sellingPrice;
    } else {
      acc.push({
        name: product.category,
        value: product.stock * product.sellingPrice
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Format time for last update
  const formatLastUpdate = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleQuickSaleClose = () => {
    setIsQuickSaleOpen(false);
  };

  const exportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      metrics,
      dailyComparison,
      todaysData,
      salesData,
      lowStockProducts: lowStockProducts.length
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowdesk-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          <p className="text-xs text-gray-500 mt-1">Last updated: {formatLastUpdate()}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm" onClick={exportReport}>
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => setIsQuickSaleOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Quick Sale
          </Button>
        </div>
      </div>

      {/* Real-time Today's Sales - Hero Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl border-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-100 animate-pulse" />
              <p className="text-sm font-medium text-blue-100">Today's Sales (Live)</p>
            </div>
            <p className="text-4xl font-bold text-white mb-2">
              {formatCurrency(todaysData.total, businessSettings.currency)}
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-blue-100 flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                {todaysData.transactions} transaction{todaysData.transactions !== 1 ? 's' : ''}
              </span>
              {dailyComparison.change !== 0 && (
                <span className={`text-sm flex items-center font-medium ${
                  dailyComparison.change > 0 ? 'text-green-200' : 'text-red-200'
                }`}>
                  {dailyComparison.change > 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(dailyComparison.change).toFixed(1)}% vs yesterday
                </span>
              )}
            </div>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
        </div>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Sales */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.totalSales, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>

        {/* Stock Value */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.stockValue, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Invoices */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.invoicesCount}</p>
            </div>
          </div>
        </Card>

        {/* Appointments */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.appointmentsCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Sales Comparison */}
      <Card>
        <CardHeader title="Daily Sales Comparison" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(dailyComparison.today, businessSettings.currency)}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">Today's Revenue</div>
            <div className="text-xs text-gray-500">
              {dailyComparison.todayTransactions} transactions
            </div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {formatCurrency(dailyComparison.yesterday, businessSettings.currency)}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">Yesterday's Revenue</div>
            <div className="text-xs text-gray-500">
              {dailyComparison.yesterdayTransactions} transactions
            </div>
          </div>
          
          <div className={`text-center p-6 rounded-xl ${
            dailyComparison.change >= 0 
              ? 'bg-gradient-to-br from-green-50 to-green-100' 
              : 'bg-gradient-to-br from-red-50 to-red-100'
          }`}>
            <div className={`text-3xl font-bold mb-2 flex items-center justify-center ${
              dailyComparison.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {dailyComparison.change >= 0 ? (
                <ArrowUp className="w-6 h-6 mr-1" />
              ) : (
                <ArrowDown className="w-6 h-6 mr-1" />
              )}
              {Math.abs(dailyComparison.change).toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">Change from Yesterday</div>
            <div className="text-xs text-gray-500">
              {dailyComparison.change >= 0 ? 'Increase' : 'Decrease'}
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {(metrics.lowStockProducts > 0 || metrics.overdueInvoices > 0) && (
        <Card>
          <CardHeader title="Alerts" />
          <div className="space-y-3">
            {metrics.lowStockProducts > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-red-600">
                    {metrics.lowStockProducts} products are running low on stock
                  </p>
                </div>
              </div>
            )}
            {metrics.overdueInvoices > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Overdue Invoices
                  </p>
                  <p className="text-sm text-yellow-600">
                    {metrics.overdueInvoices} invoices are overdue
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Sales Trend (Last 7 Days)" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value), businessSettings.currency), 'Sales']}
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
          <CardHeader title="Inventory Value by Category" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value), businessSettings.currency), 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Low Stock Products" />
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No low stock alerts</p>
            ) : (
              lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {product.stock} remaining
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {product.minStock}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Sales (Live)" />
          <div className="space-y-3">
            {sales.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent sales</p>
            ) : (
              sales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sale.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(sale.createdAt).toLocaleDateString()} at {new Date(sale.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(sale.total, businessSettings.currency)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Sale Modal */}
      <Modal
        isOpen={isQuickSaleOpen}
        onClose={handleQuickSaleClose}
        title="Quick Sale"
        size="xl"
      >
        <SaleForm onClose={handleQuickSaleClose} />
      </Modal>
    </div>
  );
};