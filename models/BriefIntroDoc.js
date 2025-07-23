const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  frontPageImage: {
    type: String,
    required: true
  },
  downloadUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'Hindi'
  },
  category: {
    type: String,
    required: true,
    enum: ['Introduction', 'Rituals', 'Philosophy', 'History', 'Prayers', 'Teachings', 'General']
  },
  author: {
    type: String,
    required: true
  },
  publishedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  downloads: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const briefIntroDocSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "Download Brief Introduction"
    },
    subtitle: {
      type: String,
      default: "Sacred Documents & Spiritual Guides"
    },
    description: {
      type: String,
      default: "Explore our comprehensive collection of spiritual documents, introductory guides, and sacred texts. Download these valuable resources to deepen your understanding of our teachings and practices."
    }
  },
  documents: [documentSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
briefIntroDocSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Index for better performance
briefIntroDocSchema.index({ 'documents.featured': 1 });
briefIntroDocSchema.index({ 'documents.category': 1 });
briefIntroDocSchema.index({ 'documents.isActive': 1 });

module.exports = mongoose.model('BriefIntroDoc', briefIntroDocSchema); 