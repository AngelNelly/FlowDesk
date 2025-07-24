import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar, 
  Settings,
  Building2,
  X,
  ShoppingBag
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { customLogo, isDarkMode } = useTheme();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:fixed inset-y-0 left-0 z-50 lg:z-30
        w-64 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        ${isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
        }
        border-r
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 flex-shrink-0
          ${isDarkMode 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-gray-50'
          }
          border-b
        `}>
          <div className="flex items-center space-x-3">
            {customLogo ? (
              <img src={customLogo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            ) : (
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
              <span className="text-xl font-bold text-gray-900 dark:text-white truncate">Flowdesk</span>
          </div>
          <button
            onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-200 flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className={`
          flex-1 overflow-y-auto py-4
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        `}>
          <div className="space-y-1 px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? isDarkMode
                        ? 'bg-blue-900/50 text-blue-200 border-r-2 border-blue-400'
                        : 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : isDarkMode
                        ? 'text-white hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.name === 'Marketplace' && (
                    <span className={`
                      ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0
                      ${isDarkMode 
                        ? 'bg-green-900 text-green-100' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Footer */}
        <div className={`
          p-4 flex-shrink-0
          ${isDarkMode 
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
          }
          border-t
        `}>
          <div className="text-xs text-gray-500 dark:text-white text-center">
            <div className="font-medium">Flowdesk v2.0</div>
            <div className="mt-1">Built for African SMEs</div>
          </div>
        </div>
      </div>
    </>
  );
};