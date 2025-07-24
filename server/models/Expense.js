const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide expense title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide expense amount'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    enum: ['NGN', 'KES', 'GHS', 'ZAR', 'USD', 'EUR'],
    default: 'NGN'
  },
  category: {
    type: String,
    required: [true, 'Please provide expense category'],
    enum: [
      'rent',
      'utilities',
      'salaries',
      'supplies',
      'marketing',
      'transport',
      'equipment',
      'maintenance',
      'insurance',
      'taxes',
      'professional-services',
      'meals',
      'travel',
      'other'
    ]
  },
  subcategory: String,
  date: {
    type: Date,
    required: [true, 'Please provide expense date'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'cheque', 'mobile'],
    required: true
  },
  vendor: {
    name: String,
    contact: String,
    email: String
  },
  receiptNumber: String,
  invoiceNumber: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
  },
  nextDueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected'],
    default: 'paid'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    type: String
  }],
  tags: [String],
  notes: String,
  taxDeductible: {
    type: Boolean,
    default: false
  },
  project: String,
  location: String
}, {
  timestamps: true
});

// Create index for date and category queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);