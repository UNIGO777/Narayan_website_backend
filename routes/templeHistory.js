const express = require('express');
const router = express.Router();
const TempleHistory = require('../models/TempleHistory');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockTempleHistoryData = {
  sectionInfo: {
    title: "Temple History",
    subtitle: "Our Sacred Heritage",
    description: "Discover the rich history and spiritual significance of our temple. Learn about our traditions, architecture, and the stories that have shaped our community over the years."
  },
  timeline: [
    {
      year: "1500",
      title: "Foundation of Sacred Site",
      description: "The sacred site was established by Shree Sadguru Narayan Swami, who performed deep Tapasya and took Sanjeevan Samadhi at this divine location.",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1470&auto=format&fit=crop",
      order: 1
    },
    {
      year: "1800",
      title: "Temple Construction",
      description: "The main temple structure was built by devotees and local community members to honor the sacred samadhi.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1470&auto=format&fit=crop",
      order: 2
    },
    {
      year: "1950",
      title: "Community Growth",
      description: "The temple community expanded with more devotees joining and various spiritual programs being established.",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1470&auto=format&fit=crop",
      order: 3
    },
    {
      year: "2000",
      title: "Modern Era",
      description: "The temple embraced modern facilities while maintaining its traditional values and spiritual essence.",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1470&auto=format&fit=crop",
      order: 4
    }
  ]
};

// GET - Get TempleHistory data
router.get('/', async (req, res) => {
  try {
    let templeHistory = await TempleHistory.findOne();
    
    if (!templeHistory) {
      templeHistory = mockTempleHistoryData;
    }
    
    res.json(templeHistory);
  } catch (error) {
    console.error('Error fetching TempleHistory data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TempleHistory data',
      details: error.message 
    });
  }
});

// PUT - Update TempleHistory data
router.put('/', requireEditor, async (req, res) => {
  try {
    const updateData = req.body;
    
    let templeHistory = await TempleHistory.findOne();
    
    if (!templeHistory) {
      templeHistory = new TempleHistory(updateData);
    } else {
      Object.assign(templeHistory, updateData);
    }
    
    await templeHistory.save();
    res.json(templeHistory);
  } catch (error) {
    console.error('Error updating TempleHistory:', error);
    res.status(500).json({ 
      error: 'Failed to update TempleHistory data',
      details: error.message 
    });
  }
});

// DELETE - Delete TempleHistory data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await TempleHistory.deleteMany({});
    res.json({ message: 'TempleHistory data reset to defaults' });
  } catch (error) {
    console.error('Error resetting TempleHistory data:', error);
    res.status(500).json({ 
      error: 'Failed to reset TempleHistory data',
      details: error.message 
    });
  }
});

module.exports = router; 