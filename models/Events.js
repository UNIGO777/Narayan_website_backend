const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  pageInfo: {
    title: {
      type: String,
      default: "Upcoming Temple Events"
    },
    description: {
      type: String,
      default: "Join us for a variety of spiritual, cultural, and community events throughout the year. Our temple hosts regular celebrations, workshops, discourses, and service activities to nurture spiritual growth and community connection."
    }
  },
  categories: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
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
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    image: {
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

module.exports = mongoose.model('Events', eventsSchema); 