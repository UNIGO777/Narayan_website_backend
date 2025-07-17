const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
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
  }
});

const raktDaanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Sankalpa Rakta Daan"
  },
  subtitle: {
    type: String,
    required: true,
    default: "SAVE LIVES"
  },
  description: {
    type: String,
    required: true,
    default: "Join our sacred mission to save lives through blood donation. Our temple organizes regular blood donation camps in partnership with local hospitals and blood banks. Your contribution can make a significant difference in someone's life."
  },
  quote: {
    type: String,
    default: "To donate blood is to give the gift of life. It costs nothing but a few minutes of your time, but means everything to the recipient."
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1528&auto=format&fit=crop"
  },
  upcomingEvents: [upcomingEventSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('RaktDaan', raktDaanSchema); 