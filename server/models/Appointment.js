const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide appointment title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  duration: {
    type: Number,
    required: true,
    min: [15, 'Duration must be at least 15 minutes']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  location: {
    type: String,
    trim: true
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Actual cost cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: Date,
  notes: String,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['customer', 'business']
  },
  rescheduledFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

// Validate that end date is after start date
appointmentSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  
  // Calculate duration if not provided
  if (!this.duration) {
    this.duration = Math.round((this.endDate - this.startDate) / (1000 * 60));
  }
  
  next();
});

// Create index for date range queries
appointmentSchema.index({ startDate: 1, endDate: 1 });
appointmentSchema.index({ user: 1, startDate: 1 });
appointmentSchema.index({ customer: 1, startDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);