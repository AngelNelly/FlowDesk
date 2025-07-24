import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = true 
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`
      rounded-lg shadow-sm border transition-all duration-200
      ${isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-100'
      }
      ${padding ? 'p-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  action 
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};