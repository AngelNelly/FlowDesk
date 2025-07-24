const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    default: 'product'
  },
  pricing: {
    costPrice: {
      type: Number,
      required: [true, 'Please provide a cost price'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please provide a selling price'],
      min: [0, 'Selling price cannot be negative']
    },
    wholesalePrice: {
      type: Number,
      min: [0, 'Wholesale price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['NGN', 'KES', 'GHS', 'ZAR', 'USD', 'EUR'],
      default: 'NGN'
    }
  },
  inventory: {
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    minStock: {
      type: Number,
      default: 5,
      min: [0, 'Minimum stock cannot be negative']
    },
    maxStock: {
      type: Number,
      min: [0, 'Maximum stock cannot be negative']
    },
    unit: {
      type: String,
      enum: ['piece', 'kg', 'g', 'liter', 'ml', 'meter', 'cm', 'box', 'pack'],
      default: 'piece'
    },
    location: {
      type: String,
      trim: true
    }
  },
  variants: [variantSchema],
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  isLowStock: {
    type: Boolean,
    default: false
  },
  lastRestocked: Date,
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  notes: String
}, {
  timestamps: true
});

// Create index for text search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  sku: 'text', 
  category: 'text',
  brand: 'text'
});

// Check if product is low stock before saving
productSchema.pre('save', function(next) {
  this.isLowStock = this.inventory.stock <= this.inventory.minStock;
  next();
});

// Calculate profit margin
productSchema.virtual('profitMargin').get(function() {
  const profit = this.pricing.sellingPrice - this.pricing.costPrice;
  return ((profit / this.pricing.costPrice) * 100).toFixed(2);
});

// Calculate total value
productSchema.virtual('totalValue').get(function() {
  return this.inventory.stock * this.pricing.costPrice;
});

module.exports = mongoose.model('Product', productSchema);