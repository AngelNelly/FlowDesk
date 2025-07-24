const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  customerType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  businessInfo: {
    companyName: String,
    industry: String,
    taxId: String
  },
  loyaltyStatus: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalPurchases: {
    type: Number,
    default: 0,
    min: [0, 'Total purchases cannot be negative']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  lastPurchaseDate: Date,
  firstPurchaseDate: Date,
  preferredPaymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'mobile', 'credit']
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: [0, 'Credit limit cannot be negative']
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  tags: [String],
  notes: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['walk-in', 'referral', 'online', 'social-media', 'advertisement'],
    default: 'walk-in'
  },
  referredBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer'
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    smsMarketing: { type: Boolean, default: true },
    emailMarketing: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Create index for text search
customerSchema.index({ 
  name: 'text', 
  email: 'text', 
  phone: 'text',
  'businessInfo.companyName': 'text'
});

// Update loyalty status based on total spent
customerSchema.pre('save', function(next) {
  if (this.totalSpent >= 1000000) {
    this.loyaltyStatus = 'platinum';
  } else if (this.totalSpent >= 500000) {
    this.loyaltyStatus = 'gold';
  } else if (this.totalSpent >= 100000) {
    this.loyaltyStatus = 'silver';
  } else {
    this.loyaltyStatus = 'bronze';
  }
  
  // Calculate average order value
  if (this.totalPurchases > 0) {
    this.averageOrderValue = this.totalSpent / this.totalPurchases;
  }
  
  next();
});

module.exports = mongoose.model('Customer', customerSchema);