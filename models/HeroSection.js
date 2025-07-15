const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "नारायण गुरुकुल"
  },
  subtitle: {
    type: String,
    required: true,
    default: "श्री नारायण गुरुकुल में आपका स्वागत है"
  },
  description: {
    type: String,
    required: true,
    default: "हमारे पवित्र मंदिर में आध्यात्मिक यात्रा में हमारे साथ जुड़ें। यह स्थान आपकी आंतरिक शांति और आध्यात्मिक विकास के लिए समर्पित है।"
  },
  videoUrl: {
    type: String,
    required: true,
    default: "/assets/HeroVideo.mp4"
  },
  videoType: {
    type: String,
    default: "mp4"
  },
  backgroundOverlay: {
    type: Number,
    default: 0.4,
    min: 0,
    max: 1
  },
  buttonText: {
    type: String,
    default: "अधिक जानें"
  },
  buttonLink: {
    type: String,
    default: "#about"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HeroSection', heroSectionSchema); 