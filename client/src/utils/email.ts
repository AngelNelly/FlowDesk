import emailjs from '@emailjs/browser';
import { Invoice, BusinessSettings } from '../types';
import { formatCurrency, formatDate } from './storage';

// EmailJS Configuration
// To set up real email sending:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and get your service ID, template ID, and public key
// 3. Replace the values below with your actual EmailJS credentials

const EMAIL_CONFIG = {
  serviceId: 'service_flowdesk', // Replace with your EmailJS service ID
  invoiceTemplateId: 'template_invoice', // Replace with your invoice template ID
  reminderTemplateId: 'template_reminder', // Replace with your reminder template ID
  publicKey: 'flowdesk_public_key' // Replace with your EmailJS public key
};

// Initialize EmailJS
const initEmailJS = () => {
  if (EMAIL_CONFIG.publicKey !== 'flowdesk_public_key') {
    emailjs.init(EMAIL_CONFIG.publicKey);
  }
};

export interface EmailInvoiceData {
  to_email: string;
  to_name: string;
  company_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  currency: string;
  invoice_items: string;
  subtotal: string;
  tax_amount: string;
  tax_rate: string;
  notes?: string;
  status: string;
  invoice_html: string;
}

export const sendInvoiceEmail = async (
  invoice: Invoice, 
  customerEmail: string, 
  settings: BusinessSettings
): Promise<boolean> => {
  try {
    initEmailJS();

    // Check if EmailJS is properly configured
    if (!isEmailConfigured()) {
      // For demo purposes, show a detailed message about email setup
      console.log('📧 EMAIL DEMO MODE - Invoice would be sent to:', customerEmail);
      console.log('To enable real email sending:');
      console.log('1. Sign up at https://www.emailjs.com/');
      console.log('2. Create email templates');
      console.log('3. Update EMAIL_CONFIG in src/utils/email.ts');
      
      // Simulate successful sending for demo
      await simulateEmailSending(invoice, customerEmail, settings);
      return true;
    }

    // Prepare invoice items as formatted string
    const itemsText = invoice.items.map(item => 
      `${item.productName} - Qty: ${item.quantity} - ${formatCurrency(item.unitPrice, settings.currency)} = ${formatCurrency(item.total, settings.currency)}`
    ).join('\n');

    // Generate HTML version of invoice
    const invoiceHTML = generateInvoiceEmailHTML(invoice, settings);

    const emailData: EmailInvoiceData = {
      to_email: customerEmail,
      to_name: invoice.customerName,
      company_name: settings.companyName,
      invoice_number: invoice.invoiceNumber,
      invoice_date: formatDate(invoice.createdAt),
      due_date: formatDate(invoice.dueDate),
      total_amount: formatCurrency(invoice.total, settings.currency),
      currency: settings.currency,
      invoice_items: itemsText,
      subtotal: formatCurrency(invoice.subtotal, settings.currency),
      tax_amount: formatCurrency(invoice.tax, settings.currency),
      tax_rate: settings.taxRate.toString(),
      notes: invoice.notes || '',
      status: invoice.status.toUpperCase(),
      invoice_html: invoiceHTML
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.invoiceTemplateId,
      emailData
    );

    if (response.status === 200) {
      logEmailSent(invoice, customerEmail, 'invoice');
      return true;
    } else {
      throw new Error('Email sending failed');
    }
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return false;
  }
};

export const sendInvoiceReminder = async (
  invoice: Invoice,
  customerEmail: string,
  settings: BusinessSettings,
  reminderType: 'gentle' | 'urgent' = 'gentle'
): Promise<boolean> => {
  try {
    initEmailJS();

    if (!isEmailConfigured()) {
      console.log('📧 REMINDER DEMO MODE - Reminder would be sent to:', customerEmail);
      await simulateEmailSending(invoice, customerEmail, settings, 'reminder');
      return true;
    }

    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    
    const reminderData = {
      to_email: customerEmail,
      to_name: invoice.customerName,
      company_name: settings.companyName,
      invoice_number: invoice.invoiceNumber,
      invoice_date: formatDate(invoice.createdAt),
      due_date: formatDate(invoice.dueDate),
      total_amount: formatCurrency(invoice.total, settings.currency),
      days_overdue: daysOverdue,
      reminder_type: reminderType,
      urgency_message: reminderType === 'urgent' 
        ? 'URGENT: This invoice is significantly overdue' 
        : 'Friendly reminder about your pending invoice'
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.reminderTemplateId,
      reminderData
    );

    if (response.status === 200) {
      logEmailSent(invoice, customerEmail, 'reminder');
      return true;
    } else {
      throw new Error('Reminder sending failed');
    }
  } catch (error) {
    console.error('Failed to send invoice reminder:', error);
    return false;
  }
};

const simulateEmailSending = async (
  invoice: Invoice, 
  customerEmail: string, 
  settings: BusinessSettings,
  type: 'invoice' | 'reminder' = 'invoice'
) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Log the email for demo purposes
  logEmailSent(invoice, customerEmail, type);
  
  // Show what would be sent
  console.log(`📧 ${type.toUpperCase()} EMAIL SIMULATION:`);
  console.log(`To: ${customerEmail}`);
  console.log(`Subject: ${type === 'invoice' ? `Invoice ${invoice.invoiceNumber} from ${settings.companyName}` : `Payment Reminder - Invoice ${invoice.invoiceNumber}`}`);
  console.log(`Amount: ${formatCurrency(invoice.total, settings.currency)}`);
  console.log('✅ Email simulation completed successfully');
};

const logEmailSent = (invoice: Invoice, customerEmail: string, type: 'invoice' | 'reminder') => {
  const emailLog = {
    id: Date.now().toString(),
    invoiceId: invoice.id,
    customerEmail,
    type,
    sentAt: new Date(),
    status: 'sent'
  };
  
  const existingLogs = JSON.parse(localStorage.getItem('flowdesk_email_logs') || '[]');
  existingLogs.push(emailLog);
  localStorage.setItem('flowdesk_email_logs', JSON.stringify(existingLogs));
};

export const isEmailConfigured = (): boolean => {
  return EMAIL_CONFIG.serviceId !== 'service_flowdesk' && 
         EMAIL_CONFIG.invoiceTemplateId !== 'template_invoice' && 
         EMAIL_CONFIG.publicKey !== 'flowdesk_public_key';
};

export const getEmailLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('flowdesk_email_logs') || '[]');
  } catch {
    return [];
  }
};

// Email template for invoice (HTML format)
export const generateInvoiceEmailHTML = (invoice: Invoice, settings: BusinessSettings): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f5f5f5;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: linear-gradient(135deg, #3B82F6, #1D4ED8); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
            .header h2 { margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; }
            .content { padding: 30px; }
            .invoice-details { 
                background: #f8fafc; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 8px; 
                border-left: 4px solid #3B82F6;
            }
            .invoice-details h3 { margin-top: 0; color: #1f2937; }
            .items-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .items-table th { 
                background: #374151; 
                color: white; 
                padding: 15px 10px; 
                text-align: left; 
                font-weight: 600;
            }
            .items-table td { 
                border-bottom: 1px solid #e5e7eb; 
                padding: 12px 10px; 
            }
            .items-table tr:nth-child(even) { background: #f9fafb; }
            .total-section { 
                background: #f0f9ff; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 8px; 
                border: 1px solid #bfdbfe;
            }
            .total-section h3 { 
                color: #1e40af; 
                font-size: 24px; 
                margin: 10px 0 0 0; 
            }
            .footer { 
                text-align: center; 
                padding: 30px 20px; 
                background: #f8fafc; 
                color: #6b7280; 
                font-size: 14px; 
            }
            .status { 
                padding: 6px 12px; 
                border-radius: 20px; 
                font-weight: 600; 
                font-size: 12px; 
                text-transform: uppercase; 
                letter-spacing: 0.5px;
            }
            .status.paid { background: #dcfce7; color: #166534; }
            .status.unpaid { background: #fee2e2; color: #991b1b; }
            .status.partial { background: #fef3c7; color: #92400e; }
            .btn { 
                display: inline-block; 
                padding: 12px 24px; 
                background: #3B82F6; 
                color: white; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600; 
                margin: 20px 0;
            }
            .amount-highlight { 
                font-size: 20px; 
                font-weight: 700; 
                color: #1e40af; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${settings.companyName}</h1>
                <h2>Invoice ${invoice.invoiceNumber}</h2>
            </div>
            
            <div class="content">
                <div class="invoice-details">
                    <h3>📋 Invoice Details</h3>
                    <p><strong>Invoice Date:</strong> ${formatDate(invoice.createdAt)}</p>
                    <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
                    <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status}</span></p>
                    <p><strong>Bill To:</strong> ${invoice.customerName}</p>
                </div>
                
                <h3>📦 Items</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td><strong>${item.productName}</strong></td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.unitPrice, settings.currency)}</td>
                                <td><strong>${formatCurrency(item.total, settings.currency)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total-section">
                    <p><strong>Subtotal:</strong> ${formatCurrency(invoice.subtotal, settings.currency)}</p>
                    <p><strong>Tax (${settings.taxRate}%):</strong> ${formatCurrency(invoice.tax, settings.currency)}</p>
                    <h3>💰 Total Amount: <span class="amount-highlight">${formatCurrency(invoice.total, settings.currency)}</span></h3>
                </div>
                
                ${invoice.notes ? `
                    <div class="invoice-details">
                        <h3>📝 Notes</h3>
                        <p>${invoice.notes}</p>
                    </div>
                ` : ''}
                
                ${invoice.status !== 'paid' ? `
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 16px; color: #374151;">Please process payment by the due date to avoid late fees.</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <p><strong>Thank you for your business! 🙏</strong></p>
                <p>This invoice was generated by ${settings.companyName} using Flowdesk</p>
                <p style="margin-top: 15px; font-size: 12px;">
                    If you have any questions about this invoice, please contact us immediately.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Email setup instructions
export const getEmailSetupInstructions = () => {
  return {
    title: "Set Up Real Email Sending",
    steps: [
      {
        step: 1,
        title: "Create EmailJS Account",
        description: "Go to https://www.emailjs.com/ and create a free account"
      },
      {
        step: 2,
        title: "Add Email Service",
        description: "Connect your email provider (Gmail, Outlook, etc.) to EmailJS"
      },
      {
        step: 3,
        title: "Create Email Templates",
        description: "Create templates for invoices and reminders with the required variables"
      },
      {
        step: 4,
        title: "Update Configuration",
        description: "Replace the placeholder values in src/utils/email.ts with your actual EmailJS credentials"
      },
      {
        step: 5,
        title: "Test Email Sending",
        description: "Send a test invoice to verify everything is working correctly"
      }
    ],
    variables: [
      "{{to_email}} - Customer email address",
      "{{to_name}} - Customer name", 
      "{{company_name}} - Your company name",
      "{{invoice_number}} - Invoice number",
      "{{invoice_date}} - Invoice creation date",
      "{{due_date}} - Payment due date",
      "{{total_amount}} - Total amount formatted",
      "{{invoice_html}} - Complete HTML invoice"
    ]
  };
};