const express = require('express');
const router = express.Router();
const SharmDaan = require('../models/SharmDaan');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockSharmDaanData = {
  sectionInfo: {
    subtitle: "GIVE GENEROUSLY",
    title: "Sharm Daan",
    description: "Join our mission to help those in need through donations of clothing, supplies, and essentials. Our temple organizes regular charity drives in partnership with local organizations. Your contributions can make a significant difference in someone's life.",
    quote: "The best way to find yourself is to lose yourself in the service of others. What we have done for ourselves alone dies with us; what we have done for others remains and is immortal.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1470&auto=format&fit=crop",
    buttonText: "Donate Now"
  },
  events: [
    {
      title: "Winter Clothing Drive",
      date: "2024-01-20",
      time: "10:00 AM",
      location: "Main Temple Hall",
      order: 1
    },
    {
      title: "Food Distribution",
      date: "2024-01-25",
      time: "2:00 PM",
      location: "Community Center",
      order: 2
    }
  ]
};

// GET - Get SharmDaan data
router.get('/', async (req, res) => {
  try {
    let sharmDaan = await SharmDaan.findOne();
    
    if (!sharmDaan) {
      sharmDaan = mockSharmDaanData;
    }
    
    res.json(sharmDaan);
  } catch (error) {
    console.error('Error fetching SharmDaan data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch SharmDaan data',
      details: error.message 
    });
  }
});

// PUT - Update SharmDaan data
router.put('/', requireEditor, async (req, res) => {
  try {
    const updateData = req.body;
    
    let sharmDaan = await SharmDaan.findOne();
    
    if (!sharmDaan) {
      sharmDaan = new SharmDaan(updateData);
    } else {
      Object.assign(sharmDaan, updateData);
    }
    
    await sharmDaan.save();
    res.json(sharmDaan);
  } catch (error) {
    console.error('Error updating SharmDaan:', error);
    res.status(500).json({ 
      error: 'Failed to update SharmDaan data',
      details: error.message 
    });
  }
});

// DELETE - Delete SharmDaan data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await SharmDaan.deleteMany({});
    res.json({ message: 'SharmDaan data reset to defaults' });
  } catch (error) {
    console.error('Error resetting SharmDaan data:', error);
    res.status(500).json({ 
      error: 'Failed to reset SharmDaan data',
      details: error.message 
    });
  }
});

module.exports = router; 