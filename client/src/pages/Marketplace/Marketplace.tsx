import React, { useState } from 'react';
import { Star, Download, ExternalLink, Search, Filter, Zap, TrendingUp, BarChart, Users } from 'lucide-react';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  downloads: number;
  category: string;
  icon: React.ReactNode;
  features: string[];
  screenshots: string[];
  popular?: boolean;
}

const addOns: AddOn[] = [
  {
    id: '1',
    name: 'AI Sales Predictor',
    description: 'Predict future sales trends using machine learning algorithms based on your historical data.',
    price: 12000,
    currency: 'NGN',
    rating: 4.8,
    downloads: 1250,
    category: 'Analytics',
    icon: <TrendingUp className="w-6 h-6" />,
    features: ['Sales forecasting', 'Trend analysis', 'Inventory optimization', 'Custom reports'],
    screenshots: ['https://picsum.photos/400/300?random=1'],
    popular: true
  },
  {
    id: '2',
    name: 'Advanced Analytics Pro',
    description: 'Get deep insights into your business with advanced charts, heatmaps, and custom dashboards.',
    price: 8000,
    currency: 'NGN',
    rating: 4.6,
    downloads: 980,
    category: 'Analytics',
    icon: <BarChart className="w-6 h-6" />,
    features: ['Custom dashboards', 'Advanced charts', 'Data export', 'Real-time analytics'],
    screenshots: ['https://picsum.photos/400/300?random=2']
  },
  {
    id: '3',
    name: 'Multi-Store Manager',
    description: 'Manage multiple store locations from a single dashboard with centralized inventory.',
    price: 25000,
    currency: 'NGN',
    rating: 4.9,
    downloads: 650,
    category: 'Management',
    icon: <Users className="w-6 h-6" />,
    features: ['Multi-location support', 'Centralized inventory', 'Store performance tracking', 'Staff management'],
    screenshots: ['https://picsum.photos/400/300?random=3']
  },
  {
    id: '4',
    name: 'Automated Backup Pro',
    description: 'Automatically backup your data to cloud storage with scheduling and encryption.',
    price: 5000,
    currency: 'NGN',
    rating: 4.7,
    downloads: 1500,
    category: 'Utility',
    icon: <Zap className="w-6 h-6" />,
    features: ['Automated backups', 'Cloud storage', 'Data encryption', 'Restore tools'],
    screenshots: ['https://picsum.photos/400/300?random=4'],
    popular: true
  }
];

export const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null);

  const categories = ['All', 'Analytics', 'Management', 'Utility', 'Integration'];

  const filteredAddOns = addOns.filter(addOn => {
    const matchesSearch = addOn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addOn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || addOn.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Flowdesk Marketplace</h1>
        <p className="text-gray-600 mt-2">Extend your business capabilities with powerful add-ons</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search add-ons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Featured Add-ons */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Add-ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddOns.filter(addOn => addOn.popular).map((addOn) => (
            <Card key={addOn.id} className="relative">
              {addOn.popular && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                  Popular
                </div>
              )}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {addOn.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">{renderStars(addOn.rating)}</div>
                    <span className="text-sm text-gray-600">({addOn.rating})</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{addOn.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(addOn.price, addOn.currency)}/month
                    </span>
                    <Button size="sm" onClick={() => setSelectedAddOn(addOn)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Add-ons */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Add-ons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddOns.map((addOn) => (
            <Card key={addOn.id} className="relative hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                  {addOn.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">{renderStars(addOn.rating)}</div>
                    <span className="text-sm text-gray-600">({addOn.rating})</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{addOn.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(addOn.price, addOn.currency)}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedAddOn(addOn)}>
                        Details
                      </Button>
                      <Button size="sm">
                        Install
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{addOn.category}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      {addOn.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAddOns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No add-ons found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Add-on Detail Modal */}
      {selectedAddOn && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedAddOn(null)}
            />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {selectedAddOn.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedAddOn.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(selectedAddOn.rating)}</div>
                      <span className="text-sm text-gray-600">({selectedAddOn.rating})</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{selectedAddOn.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAddOn(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedAddOn.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="space-y-1">
                    {selectedAddOn.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(selectedAddOn.price, selectedAddOn.currency)}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                    <Button>
                      Install Add-on
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};