const express = require('express');
const router = express.Router();
const BhajanHero = require('../models/BhajanHero');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockBhajanHeroData = {
  title: "Our Sacred Bhajans",
  subtitle: "Divine Melodies for Spiritual Awakening",
  description: "Immerse yourself in the divine atmosphere through our collection of sacred bhajans. Each melody carries the essence of devotion and connects your soul to the divine consciousness.",
  backgroundImage: "/src/assets/MandirInnerImage.jpeg",
  stats: {
    totalBhajans: 45,
    totalListeners: 12500,
    averageRating: 4.8
  },
  features: [
    {
      title: "Traditional Bhajans",
      description: "Authentic devotional songs",
      iconName: "Music"
    },
    {
      title: "Soul Connection",
      description: "Connect with divine consciousness",
      iconName: "Heart"
    },
    {
      title: "High Quality Audio",
      description: "Crystal clear recordings",
      iconName: "Play"
    },
    {
      title: "Free Downloads",
      description: "Download for offline listening",
      iconName: "Download"
    }
  ]
};

// @route   GET /api/bhajan-hero
// @desc    Get bhajan hero section data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('🎵 Fetching Bhajan Hero data...');
    
    let bhajanHeroData = await BhajanHero.findOne();
    
    if (!bhajanHeroData) {
      console.log('📝 No bhajan hero data found, using mock data');
      bhajanHeroData = mockBhajanHeroData;
    }
    
    console.log('✅ Bhajan hero data fetched successfully');
    res.json({
      success: true,
      message: 'Bhajan hero data fetched successfully',
      data: bhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error fetching bhajan hero data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bhajan hero data',
      data: mockBhajanHeroData,
      error: error.message
    });
  }
});

// @route   PUT /api/bhajan-hero
// @desc    Update bhajan hero section data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Updating Bhajan Hero data...');
    const updateData = req.body;

    let bhajanHeroData = await BhajanHero.findOne();

    if (!bhajanHeroData) {
      // Create new document if none exists
      bhajanHeroData = new BhajanHero(updateData);
      // Set default features if not provided
      if (!updateData.features || updateData.features.length === 0) {
        bhajanHeroData.setDefaultFeatures();
      }
    } else {
      // Update existing document
      Object.assign(bhajanHeroData, updateData);
    }

    await bhajanHeroData.save();
    
    console.log('✅ Bhajan hero data updated successfully');
    res.json({
      success: true,
      message: 'Bhajan hero data updated successfully',
      data: bhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error updating bhajan hero data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bhajan hero data',
      error: error.message
    });
  }
});

// @route   DELETE /api/bhajan-hero
// @desc    Reset bhajan hero data to defaults
// @access  Private (Editor+)
router.delete('/', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Resetting Bhajan Hero data to defaults...');
    
    await BhajanHero.deleteMany({});
    
    console.log('✅ Bhajan hero data reset successfully');
    res.json({
      success: true,
      message: 'Bhajan hero data reset to defaults successfully',
      data: mockBhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error resetting bhajan hero data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting bhajan hero data',
      error: error.message
    });
  }
});

// @route   POST /api/bhajan-hero/feature
// @desc    Add a new feature to bhajan hero
// @access  Private (Editor+)
router.post('/feature', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Adding new feature to Bhajan Hero...');
    const { title, description, iconName } = req.body;

    if (!title || !description || !iconName) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and iconName are required'
      });
    }

    let bhajanHeroData = await BhajanHero.findOne();
    
    if (!bhajanHeroData) {
      bhajanHeroData = new BhajanHero();
      bhajanHeroData.setDefaultFeatures();
    }

    bhajanHeroData.features.push({ title, description, iconName });
    await bhajanHeroData.save();

    console.log('✅ Feature added successfully');
    res.json({
      success: true,
      message: 'Feature added successfully',
      data: bhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error adding feature:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feature',
      error: error.message
    });
  }
});

// @route   DELETE /api/bhajan-hero/feature/:featureId
// @desc    Delete a feature from bhajan hero
// @access  Private (Editor+)
router.delete('/feature/:featureId', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Deleting feature from Bhajan Hero...');
    const { featureId } = req.params;

    const bhajanHeroData = await BhajanHero.findOne();
    
    if (!bhajanHeroData) {
      return res.status(404).json({
        success: false,
        message: 'Bhajan hero data not found'
      });
    }

    bhajanHeroData.features.pull(featureId);
    await bhajanHeroData.save();

    console.log('✅ Feature deleted successfully');
    res.json({
      success: true,
      message: 'Feature deleted successfully',
      data: bhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error deleting feature:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feature',
      error: error.message
    });
  }
});

// @route   PUT /api/bhajan-hero/stats
// @desc    Update bhajan hero stats
// @access  Private (Editor+)
router.put('/stats', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Updating Bhajan Hero stats...');
    const { totalBhajans, totalListeners, averageRating } = req.body;

    let bhajanHeroData = await BhajanHero.findOne();
    
    if (!bhajanHeroData) {
      bhajanHeroData = new BhajanHero();
    }

    if (totalBhajans !== undefined) bhajanHeroData.stats.totalBhajans = totalBhajans;
    if (totalListeners !== undefined) bhajanHeroData.stats.totalListeners = totalListeners;
    if (averageRating !== undefined) bhajanHeroData.stats.averageRating = averageRating;

    await bhajanHeroData.save();

    console.log('✅ Stats updated successfully');
    res.json({
      success: true,
      message: 'Stats updated successfully',
      data: bhajanHeroData
    });
  } catch (error) {
    console.error('❌ Error updating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stats',
      error: error.message
    });
  }
});

module.exports = router; 