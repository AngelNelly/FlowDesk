import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Button } from '../../components/UI/Button';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    costPrice: product?.costPrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
    description: product?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        updateProduct(product.id, formData);
        toast.success('Product updated successfully!');
      } else {
        addProduct(formData);
        toast.success('Product added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU *
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            required
            value={formData.sku}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter SKU"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter category"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Current Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            required
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter current stock"
          />
        </div>

        <div>
          <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
            Minimum Stock Level *
          </label>
          <input
            type="number"
            id="minStock"
            name="minStock"
            required
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter minimum stock level"
          />
        </div>

        <div>
          <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
            Cost Price *
          </label>
          <input
            type="number"
            id="costPrice"
            name="costPrice"
            required
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter cost price"
          />
        </div>

        <div>
          <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700">
            Selling Price *
          </label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            required
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter selling price"
          />
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
          placeholder="Enter product description (optional)"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};