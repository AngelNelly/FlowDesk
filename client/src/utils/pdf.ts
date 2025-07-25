import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, BusinessSettings } from '../types';
import { formatCurrency, formatDate } from './storage';

export const generateInvoicePDF = async (invoice: Invoice, settings: BusinessSettings) => {
  const pdf = new jsPDF();
  
  // Set up the document
  pdf.setFontSize(20);
  pdf.setTextColor(59, 130, 246); // Blue color
  pdf.text(settings.companyName, 20, 20);
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('INVOICE', 160, 20);
  
  // Invoice details
  pdf.setFontSize(10);
  pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 160, 30);
  pdf.text(`Date: ${formatDate(invoice.createdAt)}`, 160, 35);
  pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, 160, 40);
  pdf.text(`Status: ${invoice.status.toUpperCase()}`, 160, 45);
  
  // Customer details
  pdf.setFontSize(12);
  pdf.text('Bill To:', 20, 50);
  pdf.setFontSize(10);
  pdf.text(invoice.customerName, 20, 55);
  
  // Items table header
  let yPos = 70;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text('Item', 20, yPos);
  pdf.text('Qty', 120, yPos);
  pdf.text('Price', 140, yPos);
  pdf.text('Total', 170, yPos);
  
  // Draw line under header
  pdf.line(20, yPos + 2, 190, yPos + 2);
  
  // Items
  pdf.setFont(undefined, 'normal');
  yPos += 10;
  
  invoice.items.forEach((item) => {
    pdf.text(item.productName, 20, yPos);
    pdf.text(item.quantity.toString(), 120, yPos);
    pdf.text(formatCurrency(item.unitPrice, settings.currency), 140, yPos);
    pdf.text(formatCurrency(item.total, settings.currency), 170, yPos);
    yPos += 8;
  });
  
  // Totals
  yPos += 10;
  pdf.line(120, yPos, 190, yPos);
  yPos += 5;
  
  pdf.text('Subtotal:', 140, yPos);
  pdf.text(formatCurrency(invoice.subtotal, settings.currency), 170, yPos);
  yPos += 8;
  
  pdf.text(`Tax (${settings.taxRate}%):`, 140, yPos);
  pdf.text(formatCurrency(invoice.tax, settings.currency), 170, yPos);
  yPos += 8;
  
  pdf.setFont(undefined, 'bold');
  pdf.text('Total:', 140, yPos);
  pdf.text(formatCurrency(invoice.total, settings.currency), 170, yPos);
  
  // Notes
  if (invoice.notes) {
    yPos += 20;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    pdf.text('Notes:', 20, yPos);
    pdf.text(invoice.notes, 20, yPos + 5);
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generated by Flowdesk - Business Management Solution', 20, 280);
  
  // Save the PDF
  pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
};

export const generateSalesReport = async (salesData: any[], settings: BusinessSettings) => {
  const pdf = new jsPDF();
  
  pdf.setFontSize(18);
  pdf.setTextColor(59, 130, 246);
  pdf.text('Sales Report', 20, 20);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Generated on: ${formatDate(new Date())}`, 20, 30);
  pdf.text(`Company: ${settings.companyName}`, 20, 35);
  
  // Add sales data table
  let yPos = 50;
  pdf.setFont(undefined, 'bold');
  pdf.text('Date', 20, yPos);
  pdf.text('Customer', 60, yPos);
  pdf.text('Amount', 140, yPos);
  pdf.text('Payment', 170, yPos);
  
  pdf.line(20, yPos + 2, 190, yPos + 2);
  
  pdf.setFont(undefined, 'normal');
  yPos += 10;
  
  salesData.slice(0, 20).forEach((sale) => {
    pdf.text(formatDate(sale.createdAt), 20, yPos);
    pdf.text(sale.customerName, 60, yPos);
    pdf.text(formatCurrency(sale.total, settings.currency), 140, yPos);
    pdf.text(sale.paymentMethod, 170, yPos);
    yPos += 8;
    
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
  });
  
  pdf.save('sales-report.pdf');
};