const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
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
  location: {
    type: String,
    required: true
  }
});

const MaharajTapostalPlacesSchema = new mongoose.Schema({
  sectionInfo: {
    title: {
      type: String,
      default: "Maharaj Tapostal Places"
    },
    subtitle: {
      type: String,
      default: "Sacred places where Maharaj spent time in meditation and spiritual practices"
    }
  },
  places: [PlaceSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('MaharajTapostalPlaces', MaharajTapostalPlacesSchema); 