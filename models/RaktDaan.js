const mongoose = require('mongoose');

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
  benefits: [{
    title: String,
    description: String,
    icon: String
  }],
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1528&auto=format&fit=crop"
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  nextEventDate: {
    type: String,
    default: "2024-01-15"
  },
  eventLocation: {
    type: String,
    default: "Main Temple Hall"
  },
  upcomingEvents: [{
    id: Number,
    title: String,
    date: String,
    time: String,
    location: String
  }],
  contactInfo: {
    phone: {
      type: String,
      default: "+91 9876543210"
    },
    email: {
      type: String,
      default: "raktdaan@narayangurukul.org"
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RaktDaan', raktDaanSchema); 