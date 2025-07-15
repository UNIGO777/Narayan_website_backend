const mongoose = require('mongoose');

const templeHistorySchema = new mongoose.Schema({
  heroSection: {
    title: {
      type: String,
      default: "Temple History"
    },
    subtitle: {
      type: String,
      default: "Discover the Sacred Journey of Shree Siddh Narayan Tekdi"
    }
  },
  introduction: {
    subtitle: {
      type: String,
      default: "Sacred Heritage"
    },
    title: {
      type: String,
      default: "A Divine Legacy"
    },
    description1: {
      type: String,
      default: "Shree Siddh Narayan Tekdi stands as a beacon of spiritual enlightenment, nestled in the sacred hills of Ramtek. This divine abode has been sanctified by the eternal presence of revered saints and spiritual masters who have blessed this land for centuries."
    },
    description2: {
      type: String,
      default: "The temple represents not just a place of worship, but a living testament to the profound spiritual heritage that continues to guide devotees on their path to inner peace and self-realization."
    },
    sacredSymbol: {
      title: {
        type: String,
        default: "Sacred Symbol"
      },
      description: {
        type: String,
        default: "The eternal Om resonates through every prayer and meditation at our temple"
      }
    }
  },
  timeline: {
    subtitle: {
      type: String,
      default: "Our Journey"
    },
    title: {
      type: String,
      default: "Sacred Timeline"
    },
    items: [{
      step: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  spiritualSignificance: [{
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
    gradient: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  parichay: {
    subtitle: {
      type: String,
      default: "परिचय"
    },
    title: {
      type: String,
      default: "Sacred Introduction"
    },
    description1: {
      type: String,
      default: "This is the Jyotiswaroop Darbar (Abode) of Shree Sadguru Narayan Swami. Shri Sidh Narayan Tekdi, nestled in the divine land of Ramtek, is not just a hill—it is a sacred living presence, a beacon of spiritual light, awakened and sanctified by the eternal Sanjeevan Samadhi of Shree Sadguru Narayan Swami."
    },
    description2: {
      type: String,
      default: "The hill became beautiful by the existence of Sanjeevan Samadhi of Shree Sadguru Narayan Swami. This hill became sacred by the Tapasya of Shree Dattaguru. The glorified Flag of Dharma always flies at this Narayan Tekdi. The glory of this sacred place is immense. All wishes come true if someone prays wholeheartedly to Shree Sadgurunath."
    },
    quote: {
      sanskrit: {
        type: String,
        default: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
      },
      translation: {
        type: String,
        default: "May all beings be happy, may all beings be free from illness"
      }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TempleHistory', templeHistorySchema);