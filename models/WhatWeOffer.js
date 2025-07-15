const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
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
  },
  bgColor: {
    type: String,
    default: 'bg-orange-500'
  },
  textColor: {
    type: String,
    default: 'text-white'
  }
});

const whatWeOfferSchema = new mongoose.Schema({
  sectionTitle: {
    type: String,
    required: true,
    default: 'What We Offer'
  },
  features: [featureSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('WhatWeOffer', whatWeOfferSchema); 