import React from 'react';
import { Menu, Bell, User, LogOut, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { toggleMode, isDarkMode } = useTheme();

  return (
    <header className={`
      shadow-sm flex-shrink-0
      ${isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
      border-b
    `}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className={`
              lg:hidden p-2 rounded-md transition-colors
              ${isDarkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className={`
                  pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-colors
                  ${isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }
                  border
                `}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleMode}
            className={`
              p-2 rounded-md transition-colors
              ${isDarkMode
                ? 'text-white hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }
            `}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button className={`
            relative p-2 transition-colors
            ${isDarkMode
              ? 'text-white hover:text-gray-200'
              : 'text-gray-400 hover:text-gray-600'
            }
          `}>
            <Bell className="w-6 h-6" />
            <span className={`
              absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2
              ${isDarkMode ? 'ring-gray-800' : 'ring-gray-50'}
            `}></span>
          </button>
          
          <div className="relative group">
            <button className={`
              flex items-center space-x-2 p-2 rounded-md transition-colors
              ${isDarkMode
                ? 'text-white hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                  {user?.businessName}
                </div>
              </div>
            </button>
            
            <div className={`
              absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
              transition-all duration-200
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100 shadow-lg'
              }
              border
            `}>
              <button
                onClick={logout}
                className={`
                  flex items-center px-4 py-2 text-sm w-full text-left transition-colors
                  ${isDarkMode
                    ? 'text-white hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};