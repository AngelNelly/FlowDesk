const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
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
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  }
});

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  saleNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer'
  },
  customerName: String,
  items: [saleItemSchema],
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
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'mobile', 'credit'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'paid'
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  channel: {
    type: String,
    enum: ['in-store', 'online', 'phone', 'mobile-app'],
    default: 'in-store'
  },
  location: String,
  receiptNumber: String,
  notes: String,
  refunded: {
    type: Boolean,
    default: false
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date,
  refundReason: String
}, {
  timestamps: true
});

// Generate sale number before saving
saleSchema.pre('save', async function(next) {
  if (!this.saleNumber) {
    const count = await this.constructor.countDocuments({ user: this.user });
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    this.saleNumber = `SALE-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  
  if (!this.receiptNumber) {
    this.receiptNumber = `RCP-${Date.now()}`;
  }
  
  next();
});

// Update customer statistics after sale
saleSchema.post('save', async function() {
  if (this.customer) {
    const Customer = mongoose.model('Customer');
    const customer = await Customer.findById(this.customer);
    
    if (customer) {
      customer.totalPurchases += 1;
      customer.totalSpent += this.total;
      customer.lastPurchaseDate = this.createdAt;
      
      if (!customer.firstPurchaseDate) {
        customer.firstPurchaseDate = this.createdAt;
      }
      
      await customer.save();
    }
  }
});

module.exports = mongoose.model('Sale', saleSchema);