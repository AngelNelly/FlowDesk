import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Shield,
  HelpCircle,
  FileText,
  Users,
  Globe,
  Smartphone,
  Download,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Building2 },
    { name: 'Inventory', href: '/inventory', icon: Building2 },
    { name: 'Sales', href: '/sales', icon: Building2 },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Clock }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#', icon: HelpCircle },
    { name: 'User Guide', href: '#', icon: FileText },
    { name: 'Video Tutorials', href: '#', icon: FileText },
    { name: 'Contact Support', href: '#', icon: Mail },
    { name: 'Community Forum', href: '#', icon: Users },
    { name: 'Feature Requests', href: '#', icon: Star }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Data Protection', href: '#' },
    { name: 'Refund Policy', href: '#' },
    { name: 'Security', href: '#' }
  ];

  const features = [
    'Offline-First Design',
    'Real-time Sync',
    'Multi-Currency Support',
    'Mobile Optimized',
    'Secure & Encrypted',
    'African SME Focused'
  ];

  return (
    <footer className={`
      mt-auto border-t transition-colors duration-200
      ${isDarkMode 
        ? 'bg-gray-900 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'
      }
    `}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Flowdesk
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">v2.0</p>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              The complete business management solution built specifically for African SMEs. 
              Digitize your business, track your growth, and succeed in the digital economy.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Lagos, Nigeria & Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href="mailto:support@flowdesk.com" className="hover:text-blue-600 transition-colors">
                  support@flowdesk.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+234 (0) 800 FLOWDESK</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }
                  `}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Access
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <Link
                    to={href}
                    className={`
                      flex items-center space-x-2 text-sm transition-colors hover:text-blue-600
                      ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* App Download */}
            <div className="pt-4">
              <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Install App
              </h5>
              <button className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}>
                <Smartphone className="w-4 h-4" />
                <span>Install PWA</span>
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Support & Help */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Support & Help
            </h4>
            <ul className="space-y-2">
              {supportLinks.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    className={`
                      flex items-center space-x-2 text-sm transition-colors hover:text-blue-600
                      ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Support Hours */}
            <div className={`
              p-3 rounded-lg border
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-blue-50 border-blue-200'
              }
            `}>
              <h5 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Support Hours
              </h5>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Mon-Fri: 8AM-6PM WAT<br />
                Sat: 9AM-2PM WAT<br />
                24/7 Emergency Support
              </p>
            </div>
          </div>

          {/* Features & Legal */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Flowdesk?
            </h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Legal Links */}
            <div className="pt-4">
              <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Legal & Privacy
              </h5>
              <ul className="space-y-1">
                {legalLinks.map(({ name, href }) => (
                  <li key={name}>
                    <a
                      href={href}
                      className={`
                        text-xs transition-colors hover:text-blue-600
                        ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500'}
                      `}
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`
        border-t px-4 sm:px-6 lg:px-8 py-6
        ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
      `}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                © {currentYear} Flowdesk. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Made with
                </span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  for African SMEs
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  SSL Secured
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Available in 5 Languages
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Trusted by 10,000+ SMEs
                </span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              "Built for Africans, by Africans" - Digitize. Grow. Succeed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};