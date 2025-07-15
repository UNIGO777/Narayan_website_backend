const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "हमारे बारे में"
  },
  subtitle: {
    type: String,
    required: true,
    default: "आध्यात्मिक यात्रा में हमारे साथ जुड़ें"
  },
  description: {
    type: String,
    required: true,
    default: "नारायण गुरुकुल एक पवित्र स्थान है जहाँ आध्यात्मिक शिक्षा और मानसिक शांति का संगम होता है। यहाँ हम सभी धर्मों का सम्मान करते हैं और सभी के लिए खुले हैं।"
  },
  services: [serviceSchema],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    caption: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutUs', aboutUsSchema); 