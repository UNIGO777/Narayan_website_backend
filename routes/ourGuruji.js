const express = require('express');
const router = express.Router();
const OurGuruji = require('../models/OurGuruji');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockOurGurujiData = {
  sectionInfo: {
    title: "आध्यात्मिक गुरुजी",
    subtitle: "हमारे पवित्र गुरुजी",
    description: "आपको यहाँ हमारे आध्यात्मिक गुरुजी की जानकारी मिलेगी।"
  },
  gurus: [
    {
      name: "श्री नारायण स्वामी",
      title: "मुख्य गुरुजी",
      image: "/assets/godimage.png",
      images: [
        {
          url: "/assets/godimage.png",
          alt: "श्री नारायण स्वामी",
          caption: "मुख्य गुरुजी"
        },
        {
          url: "/assets/HanumanImage.png",
          alt: "श्री नारायण स्वामी ध्यान में",
          caption: "ध्यान अवस्था में"
        },
        {
          url: "/assets/TamplePng.png",
          alt: "श्री नारायण स्वामी मंदिर में",
          caption: "मंदिर परिसर में"
        }
      ],
      description: "हमारे मुख्य गुरुजी जो आध्यात्मिक मार्गदर्शन प्रदान करते हैं।",
      bio: "श्री नारायण स्वामी एक महान आध्यात्मिक गुरु हैं जिन्होंने अपना जीवन धर्म और आध्यात्म को समर्पित किया है।",
      achievements: [
        "आध्यात्मिक मार्गदर्शन",
        "धार्मिक शिक्षा",
        "सामाजिक सेवा"
      ],
      quotes: [
        "मन की शुद्धता सें ही आत्मा का कल्याण होता है।",
        "सच्चा धर्म सेवा में है।"
      ],
      contact: {
        address: "श्री नारायण गुरुकुल, रामटेक",
        phone: "+91 9876543210",
        email: "guru@narayangurukul.org"
      }
    }
  ]
};

// GET our guruji data
router.get('/', async (req, res) => {
  try {
    let ourGuruji = await OurGuruji.findOne();
    
    if (!ourGuruji) {
      ourGuruji = mockOurGurujiData;
    }
    
    res.json(ourGuruji);
  } catch (error) {
    console.error('Error fetching our guruji data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch our guruji data',
      details: error.message 
    });
  }
});

// PUT update our guruji data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { sectionInfo, gurus } = req.body;

    let ourGuruji = await OurGuruji.findOne();
    
    if (!ourGuruji) {
      // Create new document if none exists
      // Filter out invalid _id fields for new gurus
      const processedGurus = gurus ? gurus.map(guru => {
        const processedGuru = { ...guru };
        // Remove _id if it's not a valid ObjectId (e.g., temporary IDs)
        if (processedGuru._id && (typeof processedGuru._id === 'string' && processedGuru._id.match(/^\d+$/))) {
          delete processedGuru._id;
        }
        return processedGuru;
      }) : [];

      ourGuruji = new OurGuruji({
        sectionInfo,
        gurus: processedGurus
      });
    } else {
      // Update existing document
      if (sectionInfo) {
        ourGuruji.sectionInfo = {
          ...ourGuruji.sectionInfo,
          ...sectionInfo
        };
      }
      if (gurus) {
        // Filter out invalid _id fields for new gurus
        const processedGurus = gurus.map(guru => {
          const processedGuru = { ...guru };
          // Remove _id if it's not a valid ObjectId (e.g., temporary IDs)
          if (processedGuru._id && (typeof processedGuru._id === 'string' && processedGuru._id.match(/^\d+$/))) {
            delete processedGuru._id;
          }
          return processedGuru;
        });
        
        ourGuruji.gurus = processedGurus;
      }
    }
    
    await ourGuruji.save();
    res.json(ourGuruji);
  } catch (error) {
    console.error('Error updating our guruji data:', error);
    res.status(500).json({ 
      error: 'Failed to update our guruji data',
      details: error.message 
    });
  }
});

// DELETE our guruji data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await OurGuruji.deleteMany({});
    res.json({ message: 'Our Guruji data reset to defaults' });
  } catch (error) {
    console.error('Error resetting our guruji data:', error);
    res.status(500).json({ 
      error: 'Failed to reset our guruji data',
      details: error.message 
    });
  }
});

module.exports = router; 