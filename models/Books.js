const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Spiritual', 'Philosophy', 'History', 'Biography', 'Religious', 'Meditation', 'Yoga', 'Other']
  },
  language: {
    type: String,
    required: true,
    enum: ['Hindi', 'English', 'Sanskrit', 'Mixed']
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedYear: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    default: 0
  },
  isbn: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const booksSchema = new mongoose.Schema({
  sectionInfo: {
    subtitle: {
      type: String,
      default: 'Sacred Literature'
    },
    title: {
      type: String,
      default: 'Our Books Collection'
    },
    description: {
      type: String,
      default: 'Explore our comprehensive collection of spiritual and philosophical books that guide you on your journey of self-discovery and spiritual growth.'
    }
  },
  books: [bookSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
booksSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Books', booksSchema); 