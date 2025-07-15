const express = require('express');
const router = express.Router();
const RaktDaan = require('../models/RaktDaan');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockRaktDaanData = {
  title: "Sankalpa Rakta Daan",
  subtitle: "SAVE LIVES",
  description: "Join our sacred mission to save lives through blood donation. Our temple organizes regular blood donation camps in partnership with local hospitals and blood banks. Your contribution can make a significant difference in someone's life.",
  benefits: [
    {
      title: "Health Check-up",
      description: "Free medical check-up for all donors",
      icon: "🏥"
    },
    {
      title: "Refreshments",
      description: "Nutritious refreshments after donation",
      icon: "🥤"
    },
    {
      title: "Certificate",
      description: "Certificate of appreciation for donors",
      icon: "🏆"
    }
  ],
  image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1528&auto=format&fit=crop",
  registrationOpen: true,
  nextEventDate: "2024-01-15",
  eventLocation: "Main Temple Hall",
  contactInfo: {
    phone: "+91 9876543210",
    email: "raktdaan@narayangurukul.org"
  }
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
    const { title, subtitle, description, benefits, image, registrationOpen, nextEventDate, eventLocation, contactInfo } = req.body;
    
    if (req.isMongoConnected) {
      let raktDaanData = await RaktDaan.findOne();
      
      if (!raktDaanData) {
        raktDaanData = new RaktDaan();
      }

      raktDaanData.title = title || raktDaanData.title;
      raktDaanData.subtitle = subtitle || raktDaanData.subtitle;
      raktDaanData.description = description || raktDaanData.description;
      raktDaanData.benefits = benefits || raktDaanData.benefits;
      raktDaanData.image = image || raktDaanData.image;
      raktDaanData.registrationOpen = registrationOpen !== undefined ? registrationOpen : raktDaanData.registrationOpen;
      raktDaanData.nextEventDate = nextEventDate || raktDaanData.nextEventDate;
      raktDaanData.eventLocation = eventLocation || raktDaanData.eventLocation;
      raktDaanData.contactInfo = contactInfo || raktDaanData.contactInfo;
      
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
        benefits: benefits || mockRaktDaanData.benefits,
        image: image || mockRaktDaanData.image,
        registrationOpen: registrationOpen !== undefined ? registrationOpen : mockRaktDaanData.registrationOpen,
        nextEventDate: nextEventDate || mockRaktDaanData.nextEventDate,
        eventLocation: eventLocation || mockRaktDaanData.eventLocation,
        contactInfo: contactInfo || mockRaktDaanData.contactInfo
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

module.exports = router; 