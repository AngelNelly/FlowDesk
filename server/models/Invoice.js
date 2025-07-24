const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  description: String,
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  }
});

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    enum: ['NGN', 'KES', 'GHS', 'ZAR', 'USD', 'EUR'],
    default: 'NGN'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'mobile', 'credit', 'cheque']
  },
  paymentTerms: {
    type: String,
    enum: ['immediate', 'net15', 'net30', 'net45', 'net60'],
    default: 'net30'
  },
  dueDate: {
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  paidDate: Date,
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  notes: String,
  terms: String,
  template: {
    type: String,
    enum: ['standard', 'modern', 'classic', 'minimal'],
    default: 'standard'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentDate: Date,
  remindersSent: {
    type: Number,
    default: 0
  },
  lastReminderDate: Date,
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }]
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments({ user: this.user });
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate remaining amount
  this.remainingAmount = this.total - this.paidAmount;
  
  // Update payment status based on paid amount
  if (this.paidAmount === 0) {
    this.paymentStatus = 'unpaid';
  } else if (this.paidAmount >= this.total) {
    this.paymentStatus = 'paid';
    this.status = 'paid';
    if (!this.paidDate) {
      this.paidDate = new Date();
    }
  } else {
    this.paymentStatus = 'partial';
    this.status = 'partial';
  }
  
  // Check if overdue
  if (this.dueDate < new Date() && this.paymentStatus !== 'paid') {
    this.status = 'overdue';
  }
  
  next();
});

// Calculate due date based on payment terms
invoiceSchema.pre('save', function(next) {
  if (!this.dueDate && this.paymentTerms) {
    const issueDate = this.issueDate || new Date();
    switch (this.paymentTerms) {
      case 'immediate':
        this.dueDate = issueDate;
        break;
      case 'net15':
        this.dueDate = new Date(issueDate.getTime() + 15 * 24 * 60 * 60 * 1000);
        break;
      case 'net30':
        this.dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'net45':
        this.dueDate = new Date(issueDate.getTime() + 45 * 24 * 60 * 60 * 1000);
        break;
      case 'net60':
        this.dueDate = new Date(issueDate.getTime() + 60 * 24 * 60 * 60 * 1000);
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);