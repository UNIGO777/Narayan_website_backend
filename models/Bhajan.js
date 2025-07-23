const mongoose = require('mongoose');

const bhajanSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "Our Sacred Bhajan Collection"
    },
    subtitle: {
      type: String,
      default: "Divine Melodies for Every Soul"
    },
    description: {
      type: String,
      default: "Explore our carefully curated collection of devotional bhajans, each carrying the essence of spiritual awakening and divine connection."
    }
  },
  bhajans: [{
    _id: false, // Disable automatic _id generation
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true,
      match: /^\d{1,2}:\d{2}$/
    },
    category: {
      type: String,
      required: true,
      enum: ['Mantras', 'Traditional', 'Aarti', 'Devotional', 'Festival', 'Classical', 'Modern', 'Seasonal']
    },
    timing: {
      type: String,
      required: true,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Anytime', 'Special Occasions']
    },
    downloadLink: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https:\/\/drive\.google\.com\//.test(v);
        },
        message: 'Download link must be a valid Google Drive URL'
      }
    },
    uploadedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0
    },
    playCount: {
      type: Number,
      default: 0,
      min: 0
    },
    tags: [{
      type: String,
      trim: true
    }],
    language: {
      type: String,
      default: 'Hindi',
      enum: ['Hindi', 'Sanskrit', 'English', 'Regional', 'Mixed']
    },
    difficulty: {
      type: String,
      default: 'Beginner',
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    instruments: [{
      type: String,
      enum: ['Harmonium', 'Tabla', 'Sitar', 'Flute', 'Veena', 'Tanpura', 'Dholak', 'Manjira', 'None']
    }],
    artist: {
      type: String,
      default: 'Narayan Gurukul'
    },
    composer: {
      type: String,
      default: 'Traditional'
    },
    raga: {
      type: String,
      default: ''
    },
    taal: {
      type: String,
      default: ''
    },
    lyrics: {
      type: String,
      default: ''
    },
    meaning: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  categories: [{
    type: String,
    default: () => ['All', 'Mantras', 'Traditional', 'Aarti', 'Devotional', 'Festival']
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
bhajanSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Index for better performance
bhajanSchema.index({ 'bhajans.category': 1 });
bhajanSchema.index({ 'bhajans.timing': 1 });
bhajanSchema.index({ 'bhajans.featured': 1 });
bhajanSchema.index({ 'bhajans.isActive': 1 });
bhajanSchema.index({ 'bhajans.uploadedDate': -1 });

// Method to add a new bhajan
bhajanSchema.methods.addBhajan = function(bhajanData) {
  this.bhajans.push(bhajanData);
  return this.save();
};

// Method to update bhajan by index
bhajanSchema.methods.updateBhajanByIndex = function(index, updateData) {
  if (this.bhajans[index]) {
    Object.assign(this.bhajans[index], updateData);
    return this.save();
  }
  throw new Error('Bhajan not found');
};

// Method to delete bhajan by index
bhajanSchema.methods.deleteBhajanByIndex = function(index) {
  if (this.bhajans[index]) {
    this.bhajans.splice(index, 1);
    return this.save();
  }
  throw new Error('Bhajan not found');
};

// Method to get active bhajans
bhajanSchema.methods.getActiveBhajans = function() {
  return this.bhajans.filter(bhajan => bhajan.isActive);
};

// Method to get featured bhajans
bhajanSchema.methods.getFeaturedBhajans = function() {
  return this.bhajans.filter(bhajan => bhajan.featured && bhajan.isActive);
};

// Static method to get bhajans by category
bhajanSchema.statics.getBhajansByCategory = function(category) {
  return this.aggregate([
    { $unwind: '$bhajans' },
    { $match: { 'bhajans.category': category, 'bhajans.isActive': true } },
    { $sort: { 'bhajans.uploadedDate': -1 } }
  ]);
};

module.exports = mongoose.model('Bhajan', bhajanSchema); 