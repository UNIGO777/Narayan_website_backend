const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "Featured Video"
    },
    subtitle: {
      type: String,
      default: "Spiritual Teachings & Temple Life"
    },
    description: {
      type: String,
      default: "Watch our latest spiritual discourse and get insights into temple traditions, daily practices, and the path of devotion."
    }
  },
  video: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    youtubeId: {
      type: String,
      required: true,
      trim: true
    },
    youtubeUrl: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      required: true,
      default: '0:00'
    },
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Spiritual Teachings',
        'Temple Events',
        'Daily Rituals',
        'Festivals',
        'Devotional Songs',
        'Meditation',
        'Philosophy',
        'Community Service',
        'General'
      ],
      default: 'Spiritual Teachings'
    },
    tags: [{
      type: String,
      trim: true
    }],
    featured: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
youtubeVideoSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to extract YouTube ID from URL
youtubeVideoSchema.methods.extractYouTubeId = function(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Method to generate thumbnail URL
youtubeVideoSchema.methods.generateThumbnailUrl = function() {
  if (this.video.youtubeId) {
    return `https://img.youtube.com/vi/${this.video.youtubeId}/maxresdefault.jpg`;
  }
  return '';
};

// Validate YouTube URL
youtubeVideoSchema.path('video.youtubeUrl').validate(function(value) {
  const regExp = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return regExp.test(value);
}, 'Please provide a valid YouTube URL');

// Index for better performance
youtubeVideoSchema.index({ 'video.featured': 1 });
youtubeVideoSchema.index({ 'video.isActive': 1 });
youtubeVideoSchema.index({ 'video.publishedDate': -1 });

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema); 