const mongoose = require('mongoose');

const SpritualGrowthSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'PARICHAY'
  },
  description: {
    type: String,
    required: true,
    default: `This is the Jyotiswaroop Darbar (Abode) of Shree Sadguru Narayan Swami. 
Shri Sidh Narayan Tekdi, nestled in the divine land of Ramtek, is not just a hill—it is a sacred living presence, a beacon of spiritual light, awakened and sanctified by the eternal Sanjeevan Samadhi of Shree Sadguru Narayan Swami.
More than 500 years ago, this hill became the sacred seat of Sadguru Narayan Swami's first birth, when He arrived on this earth as a silent flame of divine wisdom. It was here that He performed deep Tapasya, renouncing worldly distractions and merging fully into the divine. In time, He took Sanjeevan Samadhi at this spot—not as an end, but as a beginning of eternal grace for all who come seeking with a pure heart.
This was no ordinary moment. With His Samadhi, the hill was no longer just a place—it was transformed into a Tirthakshetra, a spiritually awakened space.
It came to be lovingly known as Narayan Tekdi—a name that echoes in the hearts of thousands of devotees, even today.
The Flag of Dharma, fluttering proudly above, symbolizes the victory of truth, love, and faith. It reminds every visitor that this hill is a living shrine, where the divine is not remembered, but felt.
It is believed—and experienced—that every prayer offered here with true devotion is fulfilled. Sadguru listens—not with ears, but with love. He answers—not in words, but in transformation.
This Sanjeevan Samadhi is more than 500 years old, yet alive, awake, and filled with the divine presence of Sadgurunath. His light continues to guide every soul that arrives here in search of meaning, peace, or healing.
In His second divine birth, Shree Sadguru Narayan Swami was reborn as Shree Samarth Sadguru Paramhans Aadkuji Baba Ji at Warkhed, Maharashtra, continuing His mission of spiritual upliftment and inner awakening. But it all began here—on this hill.
Narayan Tekdi is not only a place you visit—
It is a place that visits your heart forever.
Come.
Climb not only with your feet, but with your faith.
Bow not only with your head, but with your heart.
And experience the presence of the Sadguru who never leaves, 
Because He lives here—in every breath, every silence, every prayer.`
  },
  shortDescription: {
    type: String,
    required: true,
    default: `This is the Jyotiswaroop Darbar (Abode) of Shree Sadguru Narayan Swami. 
Shri Sidh Narayan Tekdi, nestled in the divine land of Ramtek, is not just a hill—it is a sacred living presence, 
a beacon of spiritual light, awakened and sanctified by the eternal Sanjeevan Samadhi of Shree Sadguru Narayan Swami...`
  },
  images: {
    leftColumn: {
      image1: {
        type: String,
        default: 'https://images.unsplash.com/photo-1719465236914-71562b2c59dd?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      image2: {
        type: String,
        default: 'https://images.unsplash.com/photo-1682949353534-ff912cafd3b1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    },
    rightColumn: {
      mainImage: {
        type: String,
        default: 'https://plus.unsplash.com/premium_photo-1692102550620-35f8716814b4?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      topImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1716117626586-538233aaf9ae?q=80&w=2755&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      bottomImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1593014109521-48ea09f22592?q=80&w=1000&auto=format&fit=crop'
      }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SpritualGrowth', SpritualGrowthSchema); 