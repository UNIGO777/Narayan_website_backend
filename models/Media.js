const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original name is required'],
    trim: true
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  category: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other'],
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    enum: [
      'hero-background',
      'about-images',
      'event-images',
      'gallery',
      'icons',
      'logos',
      'testimonials',
      'team',
      'general'
    ],
    default: 'general'
  },
  alt: {
    type: String,
    trim: true,
    default: ''
  },
  caption: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    width: Number,
    height: Number,
    duration: Number, // for videos
    bitrate: Number,  // for videos/audio
    fps: Number,      // for videos
    hasAudio: Boolean, // for videos
    colorProfile: String,
    exif: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  thumbnails: [{
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    width: Number,
    height: Number
  }],
  usage: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content'
    },
    context: {
      type: String,
      enum: ['hero', 'gallery', 'thumbnail', 'background', 'inline'],
      default: 'inline'
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
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

// Indexes for better performance
mediaSchema.index({ category: 1, subcategory: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ tags: 1 });

// Virtual for formatted file size
mediaSchema.virtual('formattedSize').get(function() {
  const size = this.size;
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
});

// Update lastModifiedBy
mediaSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.uploadedBy;
  }
  next();
});

module.exports = mongoose.model('Media', mediaSchema); 