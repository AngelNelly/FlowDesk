import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { ProductForm } from './ProductForm';
import { formatCurrency } from '../../utils/storage';
import { Product } from '../../types';

export const Inventory: React.FC = () => {
  const { products, updateProduct, deleteProduct, businessSettings } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your products and track stock levels.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalValue, businessSettings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card padding={false}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-3 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{product.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.sku}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Min: {product.minStock}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(product.costPrice, businessSettings.currency)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(product.sellingPrice, businessSettings.currency)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCategory ? 'Try adjusting your filters.' : 'Get started by adding a new product.'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};