const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
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
  }
});

const VipVisitsSchema = new mongoose.Schema({
  sectionInfo: {
    subtitle: {
      type: String,
      default: "DIVINE VISITS"
    },
    title: {
      type: String,
      default: "Distinguished Visitors"
    },
    description: {
      type: String,
      default: "Honoring the sacred presence of revered saints and spiritual leaders who have blessed our temple"
    }
  },
  visits: [VisitSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('VipVisits', VipVisitsSchema); 