const mongoose = require('mongoose');

const GuruSchema = new mongoose.Schema({
  name: {
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
  bgColor: {
    type: String,
    default: 'bg-amber-50'
  },
  order: {
    type: Number,
    default: 0
  }
});

const OurGurujiSchema = new mongoose.Schema({
  sectionInfo: {
    subtitle: {
      type: String,
      default: 'OUR SPIRITUAL GUIDES'
    },
    title: {
      type: String,
      default: 'Our Respected Gurujis'
    },
    description: {
      type: String,
      default: 'Learn from our esteemed spiritual teachers who embody the ancient wisdom traditions. Our gurujis provide guidance, inspiration, and authentic teachings to help you on your spiritual journey.'
    }
  },
  gurus: [GuruSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('OurGuruji', OurGurujiSchema); 