const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Navigation name is required'],
    trim: true,
    maxlength: [100, 'Navigation name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['main', 'footer', 'mobile', 'sidebar'],
    required: [true, 'Navigation type is required']
  },
  items: [{
    title: {
      type: String,
      required: [true, 'Menu item title is required'],
      trim: true,
      maxlength: [50, 'Menu item title cannot exceed 50 characters']
    },
    url: {
      type: String,
      required: [true, 'Menu item URL is required'],
      trim: true
    },
    target: {
      type: String,
      enum: ['_self', '_blank', '_parent', '_top'],
      default: '_self'
    },
    icon: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    permission: {
      type: String,
      enum: ['public', 'authenticated', 'admin'],
      default: 'public'
    },
    children: [{
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Submenu item title cannot exceed 50 characters']
      },
      url: {
        type: String,
        required: true,
        trim: true
      },
      target: {
        type: String,
        enum: ['_self', '_blank', '_parent', '_top'],
        default: '_self'
      },
      icon: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      order: {
        type: Number,
        default: 0
      },
      isActive: {
        type: Boolean,
        default: true
      },
      permission: {
        type: String,
        enum: ['public', 'authenticated', 'admin'],
        default: 'public'
      }
    }]
  }],
  settings: {
    maxDepth: {
      type: Number,
      default: 2,
      min: 1,
      max: 3
    },
    showIcons: {
      type: Boolean,
      default: true
    },
    showDescriptions: {
      type: Boolean,
      default: false
    },
    openInNewTab: {
      type: Boolean,
      default: false
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

// Sort items by order
navigationSchema.pre('save', function(next) {
  if (this.items) {
    this.items.sort((a, b) => a.order - b.order);
    this.items.forEach(item => {
      if (item.children) {
        item.children.sort((a, b) => a.order - b.order);
      }
    });
  }
  next();
});

// Update lastModifiedBy
navigationSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.createdBy;
  }
  next();
});

// Indexes for better performance
navigationSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Navigation', navigationSchema); 