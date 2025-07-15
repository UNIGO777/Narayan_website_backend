const express = require('express');
const router = express.Router();
const AboutUs = require('../models/AboutUs');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockAboutUsData = {
  title: "हमारे बारे में",
  subtitle: "आध्यात्मिक यात्रा में हमारे साथ जुड़ें",
  description: "नारायण गुरुकुल एक पवित्र स्थान है जहाँ आध्यात्मिक शिक्षा और मानसिक शांति का संगम होता है। यहाँ हम सभी धर्मों का सम्मान करते हैं और सभी के लिए खुले हैं।",
  services: [
    {
      title: "आध्यात्मिक शिक्षा",
      description: "हमारे यहाँ आध्यात्मिक शिक्षा प्रदान की जाती है।",
      icon: "🕉️"
    },
    {
      title: "ध्यान और योग",
      description: "नियमित ध्यान और योग कक्षाएं आयोजित की जाती हैं।",
      icon: "🧘"
    },
    {
      title: "धार्मिक गतिविधियाँ",
      description: "विभिन्न धार्मिक उत्सव और गतिविधियाँ आयोजित की जाती हैं।",
      icon: "🎊"
    }
  ],
  images: [
    {
      url: "/assets/godimage.png",
      alt: "देवी-देवता की मूर्ति",
      caption: "हमारे पवित्र मंदिर में स्थित देवी-देवता की मूर्तियाँ"
    },
    {
      url: "/assets/MandirInnerImage.jpeg",
      alt: "मंदिर का आंतरिक भाग",
      caption: "मंदिर का सुंदर आंतरिक भाग"
    }
  ]
};

// GET - Get about us data
router.get('/', async (req, res) => {
  try {
    if (req.isMongoConnected) {
      let aboutData = await AboutUs.findOne();
      
      if (!aboutData) {
        aboutData = new AboutUs(mockAboutUsData);
        await aboutData.save();
      }
      
      res.json({
        success: true,
        data: aboutData,
        source: 'database'
      });
    } else {
      res.json({
        success: true,
        data: mockAboutUsData,
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching about us data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about us data',
      error: error.message
    });
  }
});

// PUT - Update about us data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { title, subtitle, description, services, images } = req.body;
    
    if (req.isMongoConnected) {
      let aboutData = await AboutUs.findOne();
      
      if (!aboutData) {
        aboutData = new AboutUs();
      }
      
      aboutData.title = title || aboutData.title;
      aboutData.subtitle = subtitle || aboutData.subtitle;
      aboutData.description = description || aboutData.description;
      aboutData.services = services || aboutData.services;
      aboutData.images = images || aboutData.images;
      
      await aboutData.save();
      
      res.json({
        success: true,
        data: aboutData,
        message: 'About Us updated successfully',
        source: 'database'
      });
    } else {
      // Mock update
      const updatedData = {
        ...mockAboutUsData,
        title: title || mockAboutUsData.title,
        subtitle: subtitle || mockAboutUsData.subtitle,
        description: description || mockAboutUsData.description,
        services: services || mockAboutUsData.services,
        images: images || mockAboutUsData.images
      };
      
      res.json({
        success: true,
        data: updatedData,
        message: 'About Us updated successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error updating about us data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating about us data',
      error: error.message
    });
  }
});

module.exports = router; 