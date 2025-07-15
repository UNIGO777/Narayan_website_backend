const mongoose = require('mongoose');

const sharmDaanSchema = new mongoose.Schema({
  sectionInfo: {
    subtitle: {
      type: String,
      default: "GIVE GENEROUSLY"
    },
    title: {
      type: String,
      default: "Sharm Daan"
    },
    description: {
      type: String,
      default: "Join our mission to help those in need through donations of clothing, supplies, and essentials. Our temple organizes regular charity drives in partnership with local organizations. Your contributions can make a significant difference in someone's life."
    },
    quote: {
      type: String,
      default: "The best way to find yourself is to lose yourself in the service of others. What we have done for ourselves alone dies with us; what we have done for others remains and is immortal."
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop"
    },
    buttonText: {
      type: String,
      default: "Donate Now"
    }
  },
  events: [{
    title: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SharmDaan', sharmDaanSchema); 