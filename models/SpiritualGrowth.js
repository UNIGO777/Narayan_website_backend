const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  schedule: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  benefits: [String],
  featured: {
    type: Boolean,
    default: false
  }
});

const spiritualGrowthSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "आध्यात्मिक विकास"
  },
  subtitle: {
    type: String,
    required: true,
    default: "अपनी आंतरिक शक्ति को जगाएं"
  },
  description: {
    type: String,
    required: true,
    default: "हमारे आध्यात्मिक कार्यक्रमों के माध्यम से अपने मन, शरीर और आत्मा का विकास करें।"
  },
  programs: [programSchema],
  heroImage: {
    type: String,
    default: "/assets/spiritual-growth-hero.jpg"
  },
  benefits: [{
    title: String,
    description: String,
    icon: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SpiritualGrowth', spiritualGrowthSchema); 