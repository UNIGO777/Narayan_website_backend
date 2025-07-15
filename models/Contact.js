const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: [100, 'Contact name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['main', 'secondary', 'branch', 'emergency'],
    default: 'main'
  },
  addresses: [{
    label: {
      type: String,
      required: [true, 'Address label is required'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India'
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    isMain: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  phones: [{
    label: {
      type: String,
      required: [true, 'Phone label is required'],
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['mobile', 'landline', 'fax', 'whatsapp'],
      default: 'mobile'
    },
    isMain: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  emails: [{
    label: {
      type: String,
      required: [true, 'Email label is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    type: {
      type: String,
      enum: ['general', 'support', 'donations', 'events', 'admin'],
      default: 'general'
    },
    isMain: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  hours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: [true, 'Day is required']
    },
    openTime: {
      type: String,
      required: [true, 'Open time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    closeTime: {
      type: String,
      required: [true, 'Close time is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    isClosed: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: ''
    }
  }],
  specialHours: [{
    date: {
      type: Date,
      required: [true, 'Special hours date is required']
    },
    openTime: {
      type: String,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    closeTime: {
      type: String,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    isClosed: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      required: [true, 'Special hours note is required']
    }
  }],
  additionalInfo: {
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    directions: {
      type: String,
      trim: true
    },
    parking: {
      type: String,
      trim: true
    },
    accessibility: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one main address per contact
contactSchema.pre('save', function(next) {
  if (this.addresses) {
    const mainAddresses = this.addresses.filter(addr => addr.isMain);
    if (mainAddresses.length > 1) {
      // Keep only the first main address
      this.addresses.forEach((addr, index) => {
        if (addr.isMain && index > 0) {
          addr.isMain = false;
        }
      });
    }
  }
  next();
});

// Update lastModifiedBy
contactSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.createdBy;
  }
  next();
});

// Indexes for better performance
contactSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Contact', contactSchema); 