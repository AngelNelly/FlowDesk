import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { HelpWidget } from './HelpWidget';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div className={`
      min-h-screen flex flex-col
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
    `}>
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Main content */}
          <main className={`
            flex-1 p-4 md:p-6
            ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
          `}>
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
      
      {/* Help Widget */}
      <HelpWidget />
    </div>
  );
};