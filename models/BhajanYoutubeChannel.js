const mongoose = require('mongoose');

const bhajanYoutubeChannelSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "Our Bhajan YouTube Channel"
    },
    subtitle: {
      type: String,
      default: "Subscribe for Divine Musical Journey"
    },
    description: {
      type: String,
      default: "Join our YouTube channel to experience live bhajan sessions, traditional performances, and spiritual discussions. Get notified about new uploads and special events."
    }
  },
  channel: {
    name: {
      type: String,
      required: true,
      default: "Narayan Gurukul Bhajans"
    },
    description: {
      type: String,
      required: true,
      default: "Official YouTube channel for sacred bhajans and spiritual music from Narayan Gurukul. Experience divine melodies and traditional devotional songs."
    },
    channelUrl: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https:\/\/(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@)|youtu\.be\/)/.test(v);
        },
        message: 'Channel URL must be a valid YouTube URL'
      }
    },
    channelId: {
      type: String,
      required: true,
      trim: true
    },
    channelImage: {
      type: String,
      default: "/src/assets/logo.png"
    },
    bannerImage: {
      type: String,
      default: "/src/assets/MandirInnerImage.jpeg"
    },
    subscribers: {
      type: Number,
      default: 0,
      min: 0
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0
    },
    totalVideos: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Unverified', 'Pending'],
      default: 'Unverified'
    },
    createdDate: {
      type: Date,
      default: Date.now
    }
  },
  featuredVideos: [{
    _id: false, // Disable automatic _id generation
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
      trim: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9_-]{11}$/.test(v);
        },
        message: 'YouTube ID must be 11 characters long'
      }
    },
    youtubeUrl: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(v);
        },
        message: 'YouTube URL must be valid'
      }
    },
    thumbnailUrl: {
      type: String,
      default: function() {
        return `https://img.youtube.com/vi/${this.youtubeId}/maxresdefault.jpg`;
      }
    },
    duration: {
      type: String,
      required: true,
      match: /^\d{1,2}:\d{2}$/
    },
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: {
      type: Number,
      default: 0,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['Live Sessions', 'Traditional', 'Aarti', 'Mantra', 'Festival', 'Tutorial', 'Devotional', 'Classical']
    },
    tags: [{
      type: String,
      trim: true
    }],
    featured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    quality: {
      type: String,
      enum: ['720p', '1080p', '4K', 'HD', 'SD'],
      default: 'HD'
    },
    language: {
      type: String,
      default: 'Hindi',
      enum: ['Hindi', 'Sanskrit', 'English', 'Regional', 'Mixed']
    },
    playlist: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  playlists: [{
    _id: false, // Disable automatic _id generation
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    playlistId: {
      type: String,
      required: true
    },
    playlistUrl: {
      type: String,
      required: true
    },
    videoCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  socialLinks: {
    instagram: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
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
bhajanYoutubeChannelSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to extract YouTube ID from URL
bhajanYoutubeChannelSchema.methods.extractYouTubeId = function(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Method to generate thumbnail URL
bhajanYoutubeChannelSchema.methods.generateThumbnailUrl = function(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
};

// Method to add featured video
bhajanYoutubeChannelSchema.methods.addFeaturedVideo = function(videoData) {
  // Auto-generate thumbnail if not provided
  if (!videoData.thumbnailUrl && videoData.youtubeId) {
    videoData.thumbnailUrl = this.generateThumbnailUrl(videoData.youtubeId);
  }
  
  this.featuredVideos.push(videoData);
  return this.save();
};

// Method to update featured video by index
bhajanYoutubeChannelSchema.methods.updateFeaturedVideoByIndex = function(index, updateData) {
  if (this.featuredVideos[index]) {
    Object.assign(this.featuredVideos[index], updateData);
    return this.save();
  }
  throw new Error('Featured video not found');
};

// Method to delete featured video by index
bhajanYoutubeChannelSchema.methods.deleteFeaturedVideoByIndex = function(index) {
  if (this.featuredVideos[index]) {
    this.featuredVideos.splice(index, 1);
    return this.save();
  }
  throw new Error('Featured video not found');
};

// Method to get active featured videos
bhajanYoutubeChannelSchema.methods.getActiveFeaturedVideos = function() {
  return this.featuredVideos.filter(video => video.isActive).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });
};

// Index for better performance
bhajanYoutubeChannelSchema.index({ 'channel.isActive': 1 });
bhajanYoutubeChannelSchema.index({ 'featuredVideos.featured': 1 });
bhajanYoutubeChannelSchema.index({ 'featuredVideos.isActive': 1 });
bhajanYoutubeChannelSchema.index({ 'featuredVideos.publishedDate': -1 });
bhajanYoutubeChannelSchema.index({ 'featuredVideos.category': 1 });

// Validate YouTube URL
bhajanYoutubeChannelSchema.path('featuredVideos.youtubeUrl').validate(function(value) {
  const regExp = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return regExp.test(value);
}, 'Please provide a valid YouTube URL');

module.exports = mongoose.model('BhajanYoutubeChannel', bhajanYoutubeChannelSchema); 