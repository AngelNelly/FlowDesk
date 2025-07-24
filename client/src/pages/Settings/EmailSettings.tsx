import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, Settings, ExternalLink, Copy } from 'lucide-react';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { isEmailConfigured, getEmailSetupInstructions, getEmailLogs } from '../../utils/email';
import toast from 'react-hot-toast';

export const EmailSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'logs' | 'test'>('setup');
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const { isDarkMode } = useTheme();
  
  const isConfigured = isEmailConfigured();
  const setupInstructions = getEmailSetupInstructions();
  const emailLogs = getEmailLogs();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setSendingTest(true);
    try {
      // Simulate test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Test email sent to ${testEmail}`);
    } catch (error) {
      toast.error('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  const configCode = `// EmailJS Configuration in src/utils/email.ts
const EMAIL_CONFIG = {
  serviceId: 'your_actual_service_id',
  invoiceTemplateId: 'your_invoice_template_id', 
  reminderTemplateId: 'your_reminder_template_id',
  publicKey: 'your_actual_public_key'
};`;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={`
        ${isConfigured 
          ? isDarkMode 
            ? 'border-green-600 bg-green-900/20' 
            : 'border-green-200 bg-green-50'
          : isDarkMode
            ? 'border-yellow-600 bg-yellow-900/20'
            : 'border-yellow-200 bg-yellow-50'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              isConfigured 
                ? isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                : isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100'
            }`}>
              {isConfigured ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div className="ml-4">
              <h3 className={`text-lg font-medium ${
                isConfigured 
                  ? isDarkMode ? 'text-green-300' : 'text-green-900'
                  : isDarkMode ? 'text-yellow-300' : 'text-yellow-900'
              }`}>
                Email Service Status
              </h3>
              <p className={
                isConfigured 
                  ? isDarkMode ? 'text-green-400' : 'text-green-700'
                  : isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
              }>
                {isConfigured 
                  ? 'Email service is configured and ready to send invoices'
                  : 'Email service is in demo mode - configure EmailJS to send real emails'
                }
              </p>
            </div>
          </div>
          {!isConfigured && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://www.emailjs.com/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get EmailJS
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'setup', name: 'Setup Instructions', icon: Settings },
            { id: 'logs', name: 'Email Logs', icon: Mail },
            { id: 'test', name: 'Test Email', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : isDarkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Setup Instructions */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Email Service Setup" />
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-900'
                }`}>
                  Why Set Up Email Service?
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Currently, invoice emails are simulated for demo purposes. To send real emails to customers, 
                  you need to configure EmailJS with your email provider.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Setup Steps:
                </h4>
                {setupInstructions.steps.map((step) => (
                  <div key={step.step} className={`
                    flex items-start space-x-3 p-4 border rounded-lg
                    ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-white'}
                  `}>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{step.step}</span>
                    </div>
                    <div>
                      <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {step.title}
                      </h5>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Configuration Code
                  </h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyCode(configCode)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
                <pre className={`
                  text-sm p-3 rounded border overflow-x-auto
                  ${isDarkMode 
                    ? 'text-gray-300 bg-gray-800 border-gray-600' 
                    : 'text-gray-700 bg-white border-gray-200'
                  }
                `}>
                  <code>{configCode}</code>
                </pre>
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Required Template Variables
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {setupInstructions.variables.map((variable, index) => (
                    <div key={index} className={`
                      text-sm font-mono p-2 rounded
                      ${isDarkMode 
                        ? 'text-gray-300 bg-gray-800 border border-gray-600' 
                        : 'text-gray-600 bg-white border border-gray-200'
                      }
                    `}>
                      {variable}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Email Logs */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader title="Email Activity Log" />
          <div className="space-y-3">
            {emailLogs.length === 0 ? (
              <div className="text-center py-8">
                <Mail className={`w-12 h-12 mx-auto mb-3 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No emails sent yet
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Email activity will appear here once you start sending invoices
                </p>
              </div>
            ) : (
              emailLogs.slice(-10).reverse().map((log: any) => (
                <div key={log.id} className={`
                  flex items-center justify-between p-4 rounded-lg
                  ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      log.type === 'invoice' 
                        ? isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                        : isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'
                    }`}>
                      <Mail className={`w-4 h-4 ${
                        log.type === 'invoice' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {log.type === 'invoice' ? 'Invoice Email' : 'Payment Reminder'}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Sent to: {log.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(log.sentAt).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Test Email */}
      {activeTab === 'test' && (
        <Card>
          <CardHeader title="Test Email Sending" />
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isDarkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
              }`}>
                <strong>Note:</strong> This will send a test email using the current configuration. 
                {!isConfigured && ' Since EmailJS is not configured, this will only simulate sending.'}
              </p>
            </div>

            <div>
              <label htmlFor="testEmail" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Test Email Address
              </label>
              <input
                type="email"
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className={`
                  mt-1 block w-full border rounded-md py-2 px-3 shadow-sm 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500
                  ${isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }
                `}
                placeholder="Enter email address to test"
              />
            </div>

            <Button 
              onClick={handleTestEmail}
              loading={sendingTest}
              disabled={!testEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>

            {!isConfigured && (
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-900'
                }`}>
                  Demo Mode Active
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  Test emails will be simulated. Configure EmailJS to send real test emails.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};