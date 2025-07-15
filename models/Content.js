const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: [
      'hero-home',
      'hero-about', 
      'hero-donations',
      'hero-events',
      'about-us',
      'our-guruji',
      'spiritual-growth',
      'temple-history',
      'services',
      'donations-info',
      'events-list',
      'contact-info',
      'footer-text',
      'navbar-text',
      'general'
    ]
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      enum: ['main', 'gallery', 'thumbnail', 'background'],
      default: 'main'
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    }
  }],
  metadata: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  },
  author: {
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

// Generate slug from title
contentSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  next();
});

// Update lastModifiedBy
contentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.author;
  }
  next();
});

// Indexes for better performance
contentSchema.index({ section: 1, isPublished: 1 });
contentSchema.index({ slug: 1 });
contentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema); 