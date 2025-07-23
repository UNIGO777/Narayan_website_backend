const mongoose = require('mongoose');

const contributionItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
});

const contributionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Infrastructure', 'Clothing', 'Service', 'Accommodation', 'General']
  },
  items: [{
    type: mongoose.Schema.Types.Mixed // Can be string or object with name and description
  }],
  featured: {
    type: Boolean,
    default: false
  },
  restriction: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const contributionsSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "What You Can Contribute"
    },
    subtitle: {
      type: String,
      default: "Support Our Sacred Mission"
    },
    description: {
      type: String,
      default: "Your contributions help us serve the community and spread spiritual knowledge. Every contribution, big or small, makes a difference in our divine mission."
    }
  },
  contributions: [contributionSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
contributionsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Contributions', contributionsSchema); 