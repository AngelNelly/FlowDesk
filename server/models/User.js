const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'staff'],
    default: 'owner'
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true
  },
  businessType: {
    type: String,
    enum: ['retail', 'service', 'hybrid'],
    required: true
  },
  businessLogo: {
    type: String,
    default: ''
  },
  brandColor: {
    type: String,
    default: '#3B82F6'
  },
  currency: {
    type: String,
    enum: ['NGN', 'KES', 'GHS', 'ZAR', 'USD', 'EUR'],
    default: 'NGN'
  },
  timezone: {
    type: String,
    default: 'Africa/Lagos'
  },
  language: {
    type: String,
    enum: ['en', 'sw', 'ha', 'yo', 'ig'],
    default: 'en'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    stripeCustomerId: String,
    paystackCustomerId: String,
    currentPeriodEnd: Date
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      overdueInvoices: { type: Boolean, default: true },
      appointments: { type: Boolean, default: true }
    },
    modules: {
      inventory: { type: Boolean, default: true },
      sales: { type: Boolean, default: true },
      invoices: { type: Boolean, default: true },
      customers: { type: Boolean, default: true },
      appointments: { type: Boolean, default: true },
      expenses: { type: Boolean, default: true }
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  phoneVerificationToken: String
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);