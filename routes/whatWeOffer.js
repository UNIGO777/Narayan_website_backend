const express = require('express');
const router = express.Router();
const WhatWeOffer = require('../models/WhatWeOffer');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockWhatWeOfferData = {
  sectionTitle: "हमारी सेवाएं",
  features: [
    {
      title: "आध्यात्मिक शिक्षा",
      description: "आध्यात्मिक विकास के लिए व्यापक शिक्षा कार्यक्रम",
      icon: "🕉️",
      color: "#4F46E5"
    },
    {
      title: "ध्यान और योग",
      description: "नियमित ध्यान और योग कक्षाएं",
      icon: "🧘",
      color: "#059669"
    },
    {
      title: "धार्मिक अनुष्ठान",
      description: "पारंपरिक धार्मिक अनुष्ठान और समारोह",
      icon: "🎊",
      color: "#DC2626"
    }
  ]
};

// GET - Get what we offer data
router.get('/', async (req, res) => {
  try {
    if (req.isMongoConnected) {
      let whatWeOfferData = await WhatWeOffer.findOne();
      
      if (!whatWeOfferData) {
        whatWeOfferData = new WhatWeOffer(mockWhatWeOfferData);
        await whatWeOfferData.save();
      }
      
      res.json({
        success: true,
        data: whatWeOfferData,
        source: 'database'
      });
    } else {
      res.json({
        success: true,
        data: mockWhatWeOfferData,
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching what we offer data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching what we offer data',
      error: error.message
    });
  }
});

// PUT - Update what we offer data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { sectionTitle, features } = req.body;
    
    if (req.isMongoConnected) {
      let whatWeOfferData = await WhatWeOffer.findOne();
      
      if (!whatWeOfferData) {
        whatWeOfferData = new WhatWeOffer();
      }
      
      whatWeOfferData.sectionTitle = sectionTitle || whatWeOfferData.sectionTitle;
      whatWeOfferData.features = features || whatWeOfferData.features;
      
      await whatWeOfferData.save();
      
      res.json({
        success: true,
        data: whatWeOfferData,
        message: 'What We Offer section updated successfully',
        source: 'database'
      });
    } else {
      // Mock update
      const updatedData = {
        ...mockWhatWeOfferData,
        sectionTitle: sectionTitle || mockWhatWeOfferData.sectionTitle,
        features: features || mockWhatWeOfferData.features
      };
      
      res.json({
        success: true,
        data: updatedData,
        message: 'What We Offer section updated successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error updating what we offer data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating what we offer data',
      error: error.message
    });
  }
});

module.exports = router; 