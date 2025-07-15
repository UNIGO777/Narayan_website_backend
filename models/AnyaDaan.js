const mongoose = require('mongoose');

const anyaDaanSchema = new mongoose.Schema({
  sectionInfo: {
    subtitle: {
      type: String,
      default: "SUPPORT OUR MISSION"
    },
    title: {
      type: String,
      default: "Anya Daan"
    },
    description: {
      type: String,
      default: "Your generous donations help us maintain our temple, support community programs, and continue our spiritual and educational initiatives. Every contribution, regardless of size, makes a meaningful impact on our ability to serve the community."
    },
    quote: {
      type: String,
      default: "Giving is not just about making a donation. It is about making a difference. The value of a man resides in what he gives and not in what he is capable of receiving."
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop"
    },
    buttonText: {
      type: String,
      default: "Make a Donation"
    }
  },
  programs: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: "Ongoing"
    },
    order: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AnyaDaan', anyaDaanSchema); 