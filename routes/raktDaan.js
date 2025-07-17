const express = require('express');
const router = express.Router();
const RaktDaan = require('../models/RaktDaan');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockRaktDaanData = {
  title: "Sankalpa Rakta Daan",
  subtitle: "SAVE LIVES",
  description: "Join our sacred mission to save lives through blood donation. Our temple organizes regular blood donation camps in partnership with local hospitals and blood banks. Your contribution can make a significant difference in someone's life.",
  quote: "To donate blood is to give the gift of life. It costs nothing but a few minutes of your time, but means everything to the recipient.",
  image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1528&auto=format&fit=crop",
  upcomingEvents: [
    {
      id: 1,
      title: "Blood Donation Camp",
      date: "2024-01-15",
      time: "10:00 AM - 4:00 PM",
      location: "Main Temple Hall"
    },
    {
      id: 2,
      title: "Emergency Blood Drive",
      date: "2024-01-25",
      time: "9:00 AM - 3:00 PM",
      location: "Community Center"
    }
  ]
};

// GET - Get rakt daan data
router.get('/', async (req, res) => {
  try {
    if (req.isMongoConnected) {
      let raktDaanData = await RaktDaan.findOne();
      
      if (!raktDaanData) {
        raktDaanData = new RaktDaan(mockRaktDaanData);
        await raktDaanData.save();
      }
      
      res.json({
        success: true,
        data: raktDaanData,
        source: 'database'
      });
    } else {
      res.json({
        success: true,
        data: mockRaktDaanData,
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching rakt daan data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rakt daan data',
      error: error.message
    });
  }
});

// PUT - Update rakt daan data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { title, subtitle, description, quote, image, upcomingEvents } = req.body;
    
    if (req.isMongoConnected) {
      let raktDaanData = await RaktDaan.findOne();
      
      if (!raktDaanData) {
        raktDaanData = new RaktDaan();
      }

      // Update fields
      if (title !== undefined) raktDaanData.title = title;
      if (subtitle !== undefined) raktDaanData.subtitle = subtitle;
      if (description !== undefined) raktDaanData.description = description;
      if (quote !== undefined) raktDaanData.quote = quote;
      if (image !== undefined) raktDaanData.image = image;
      if (upcomingEvents !== undefined) raktDaanData.upcomingEvents = upcomingEvents;
      
      await raktDaanData.save();
      
      res.json({
        success: true,
        data: raktDaanData,
        message: 'Rakt Daan updated successfully',
        source: 'database'
      });
    } else {
      // Mock update
      const updatedData = {
        ...mockRaktDaanData,
        title: title || mockRaktDaanData.title,
        subtitle: subtitle || mockRaktDaanData.subtitle,
        description: description || mockRaktDaanData.description,
        quote: quote || mockRaktDaanData.quote,
        image: image || mockRaktDaanData.image,
        upcomingEvents: upcomingEvents || mockRaktDaanData.upcomingEvents
      };
      
      res.json({
        success: true,
        data: updatedData,
        message: 'Rakt Daan updated successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error updating rakt daan data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating rakt daan data',
      error: error.message
    });
  }
});

// DELETE - Reset rakt daan data to defaults
router.delete('/', requireEditor, async (req, res) => {
  try {
    if (req.isMongoConnected) {
      await RaktDaan.deleteMany({});
      res.json({
        success: true,
        message: 'Rakt Daan data reset to defaults',
        source: 'database'
      });
    } else {
      res.json({
        success: true,
        message: 'Rakt Daan data reset to defaults (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error resetting rakt daan data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting rakt daan data',
      error: error.message
    });
  }
});

module.exports = router; 