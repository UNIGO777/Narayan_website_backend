const mongoose = require('mongoose');

// Schema for individual gallery images
const GalleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Schema for gallery hero section
const GalleryHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'हमारी तस्वीरों का संग्रह'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'गतिविधियों और समारोहों की खूबसूरत यादें'
  },
  description: {
    type: String,
    required: true,
    default: 'इन तस्वीरों के माध्यम से हमारे आश्रम के विविध पहलुओं, समारोहों और भक्तों की गतिविधियों की झलक देखें।'
  },
  backgroundImage: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1627155596311-6cbf18e45356?q=80&w=2072&auto=format&fit=crop'
  }
}, { timestamps: true });

// Gallery Images model
const GalleryImage = mongoose.model('GalleryImage', GalleryImageSchema);

// Gallery Hero model
const GalleryHero = mongoose.model('GalleryHero', GalleryHeroSchema);

module.exports = {
  GalleryImage,
  GalleryHero
}; 