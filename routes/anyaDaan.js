const express = require('express');
const router = express.Router();
const AnyaDaan = require('../models/AnyaDaan');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockAnyaDaanData = {
  sectionInfo: {
    subtitle: "SUPPORT THE COMMUNITY",
    title: "Anya Daan",
    description: "Join our mission to support various community needs through donations of food, educational materials, and other essentials. Our temple organizes regular drives to help those in need.",
    quote: "Service to others is the rent you pay for your room here on earth.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1470&auto=format&fit=crop",
    buttonText: "Donate Now"
  },
  programs: [
    {
      title: "Food Distribution Drive",
      description: "Monthly food distribution program for needy families",
      amount: "₹5,000/month",
      date: "2024-01-15",
      order: 1
    },
    {
      title: "Educational Material Collection",
      description: "Collecting books, stationery, and educational materials",
      amount: "₹3,000/month",
      date: "2024-01-30",
      order: 2
    }
  ]
};

// GET - Get AnyaDaan data
router.get('/', async (req, res) => {
  try {
    let anyaDaan = await AnyaDaan.findOne();
    
    if (!anyaDaan) {
      anyaDaan = mockAnyaDaanData;
    }
    
    res.json(anyaDaan);
  } catch (error) {
    console.error('Error fetching AnyaDaan data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch AnyaDaan data',
      details: error.message 
    });
  }
});

// PUT - Update AnyaDaan data
router.put('/', requireEditor, async (req, res) => {
  try {
    const updateData = req.body;
    
    let anyaDaan = await AnyaDaan.findOne();
    
    if (!anyaDaan) {
      anyaDaan = new AnyaDaan(updateData);
    } else {
      Object.assign(anyaDaan, updateData);
    }
    
    await anyaDaan.save();
    res.json(anyaDaan);
  } catch (error) {
    console.error('Error updating AnyaDaan:', error);
    res.status(500).json({ 
      error: 'Failed to update AnyaDaan data',
      details: error.message 
    });
  }
});

// DELETE - Delete AnyaDaan data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await AnyaDaan.deleteMany({});
    res.json({ message: 'AnyaDaan data reset to defaults' });
  } catch (error) {
    console.error('Error resetting AnyaDaan data:', error);
    res.status(500).json({ 
      error: 'Failed to reset AnyaDaan data',
      details: error.message 
    });
  }
});

module.exports = router; 