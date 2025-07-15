const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Social media name is required'],
    trim: true,
    maxlength: [50, 'Social media name cannot exceed 50 characters']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: [
      'facebook',
      'instagram',
      'twitter',
      'youtube',
      'linkedin',
      'pinterest',
      'telegram',
      'whatsapp',
      'tiktok',
      'snapchat',
      'discord',
      'other'
    ]
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  username: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color'],
    default: '#000000'
  },
  followers: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showInHeader: {
    type: Boolean,
    default: true
  },
  showInFooter: {
    type: Boolean,
    default: true
  },
  openInNewTab: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  analytics: {
    clicks: {
      type: Number,
      default: 0
    },
    lastClicked: {
      type: Date,
      default: null
    },
    monthlyClicks: [{
      month: {
        type: String,
        match: [/^\d{4}-\d{2}$/, 'Please provide month in YYYY-MM format']
      },
      clicks: {
        type: Number,
        default: 0
      }
    }]
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

// Update lastModifiedBy
socialSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.createdBy;
  }
  next();
});

// Indexes for better performance
socialSchema.index({ platform: 1, isActive: 1 });
socialSchema.index({ order: 1 });

module.exports = mongoose.model('Social', socialSchema); 