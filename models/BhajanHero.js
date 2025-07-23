const mongoose = require('mongoose');

const bhajanHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Our Sacred Bhajans"
  },
  subtitle: {
    type: String,
    default: "Divine Melodies for Spiritual Awakening"
  },
  description: {
    type: String,
    default: "Immerse yourself in the divine atmosphere through our collection of sacred bhajans. Each melody carries the essence of devotion and connects your soul to the divine consciousness."
  },
  backgroundImage: {
    type: String,
    default: "/src/assets/MandirInnerImage.jpeg"
  },
  stats: {
    totalBhajans: {
      type: Number,
      default: 45
    },
    totalListeners: {
      type: Number,
      default: 12500
    },
    averageRating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    }
  },
  features: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true,
      enum: ['Music', 'Heart', 'Play', 'Download', 'Clock', 'Users', 'Star', 'Volume2']
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
bhajanHeroSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Default features
bhajanHeroSchema.methods.setDefaultFeatures = function() {
  this.features = [
    {
      title: "Traditional Bhajans",
      description: "Authentic devotional songs",
      iconName: "Music"
    },
    {
      title: "Soul Connection",
      description: "Connect with divine consciousness",
      iconName: "Heart"
    },
    {
      title: "High Quality Audio",
      description: "Crystal clear recordings",
      iconName: "Play"
    },
    {
      title: "Free Downloads",
      description: "Download for offline listening",
      iconName: "Download"
    }
  ];
};

module.exports = mongoose.model('BhajanHero', bhajanHeroSchema); 