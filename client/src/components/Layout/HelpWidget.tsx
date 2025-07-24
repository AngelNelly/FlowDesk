import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  MessageCircle, 
  Book, 
  Video, 
  Phone, 
  Mail,
  ExternalLink,
  Search,
  ChevronRight,
  Package,
  TrendingUp,
  Users
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useTheme();

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        'Setting up your business profile',
        'Adding your first products',
        'Creating your first invoice',
        'Recording your first sale',
        'Understanding the dashboard'
      ]
    },
    {
      title: 'Inventory Management',
      icon: Package,
      items: [
        'Adding products and variants',
        'Managing stock levels',
        'Setting up low stock alerts',
        'Organizing with categories',
        'Barcode scanning'
      ]
    },
    {
      title: 'Sales & Invoicing',
      icon: TrendingUp,
      items: [
        'Recording sales transactions',
        'Creating professional invoices',
        'Managing payment methods',
        'Tracking overdue payments',
        'Sending invoice reminders'
      ]
    },
    {
      title: 'Customer Management',
      icon: Users,
      items: [
        'Adding customer profiles',
        'Tracking purchase history',
        'Managing customer loyalty',
        'Setting up appointments',
        'Customer communication'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Live Chat Support',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: () => console.log('Open chat'),
      available: true
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: () => window.open('https://youtube.com/flowdesk', '_blank'),
      available: true
    },
    {
      title: 'Call Support',
      description: '+234 (0) 800 FLOWDESK',
      icon: Phone,
      action: () => window.open('tel:+2348003569337'),
      available: true
    },
    {
      title: 'Email Support',
      description: 'support@flowdesk.com',
      icon: Mail,
      action: () => window.open('mailto:support@flowdesk.com'),
      available: true
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110
          ${isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
        title="Get Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setIsOpen(false)}
            />
            
            <div className={`
              inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle 
              transition-all transform shadow-xl rounded-xl
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}>
              {/* Header */}
              <div className={`
                flex items-center justify-between p-6 border-b
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    How can we help you?
                  </h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Find answers, tutorials, and get support for Flowdesk
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex h-96">
                {/* Sidebar */}
                <div className={`
                  w-1/3 p-6 border-r overflow-y-auto
                  ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}
                `}>
                  {/* Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search help topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`
                        pl-10 w-full border rounded-lg py-2 px-3 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${isDarkMode 
                          ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                        }
                      `}
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Get Support
                    </h3>
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.title}
                          onClick={action.action}
                          className={`
                            w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors
                            ${isDarkMode 
                              ? 'hover:bg-gray-800 text-gray-300' 
                              : 'hover:bg-white text-gray-700'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{action.title}</p>
                            <p className="text-xs opacity-75">{action.description}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {searchTerm ? (
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Search Results for "{searchTerm}"
                      </h3>
                      {filteredCategories.length === 0 ? (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          No results found. Try different keywords or contact support.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {filteredCategories.map((category) => (
                            <div key={category.title}>
                              <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {category.title}
                              </h4>
                              <ul className="space-y-1">
                                {category.items.map((item, index) => (
                                  <li key={index}>
                                    <button className={`
                                      text-sm text-left hover:text-blue-600 transition-colors
                                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                                    `}>
                                      {item}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Browse Help Topics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {helpCategories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <div
                              key={category.title}
                              className={`
                                p-4 rounded-lg border transition-colors cursor-pointer
                                ${isDarkMode 
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800' 
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                                }
                              `}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                <Icon className="w-5 h-5 text-blue-600" />
                                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {category.title}
                                </h4>
                              </div>
                              <ul className="space-y-1">
                                {category.items.slice(0, 3).map((item, index) => (
                                  <li key={index} className="flex items-center justify-between group">
                                    <span className={`
                                      text-sm transition-colors group-hover:text-blue-600
                                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                                    `}>
                                      {item}
                                    </span>
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </li>
                                ))}
                                {category.items.length > 3 && (
                                  <li className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    +{category.items.length - 3} more topics
                                  </li>
                                )}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={`
                p-4 border-t text-center
                ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}
              `}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Can't find what you're looking for? 
                  <button 
                    onClick={() => window.open('mailto:support@flowdesk.com')}
                    className="text-blue-600 hover:text-blue-700 ml-1"
                  >
                    Contact our support team
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};