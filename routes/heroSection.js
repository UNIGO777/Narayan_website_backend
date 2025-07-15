const express = require('express');
const router = express.Router();
const HeroSection = require('../models/HeroSection');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockHeroData = {
  title: "नारायण गुरुकुल",
  subtitle: "श्री नारायण गुरुकुल में आपका स्वागत है",
  description: "हमारे पवित्र मंदिर में आध्यात्मिक यात्रा में हमारे साथ जुड़ें। यह स्थान आपकी आंतरिक शांति और आध्यात्मिक विकास के लिए समर्पित है।",
  videoUrl: "/assets/HeroVideo.mp4",
  videoType: "mp4",
  backgroundOverlay: 0.4,
  source: "mock"
};

// GET - Get hero section data
router.get('/', async (req, res) => {
  try {
    if (req.isMongoConnected) {
      let heroData = await HeroSection.findOne();
      
      if (!heroData) {
        heroData = new HeroSection(mockHeroData);
        await heroData.save();
      }
      
      res.json({
        success: true,
        data: heroData,
        source: 'database'
      });
    } else {
      res.json({
        success: true,
        data: mockHeroData,
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero section data',
      error: error.message
    });
  }
});

// PUT - Update hero section data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { title, subtitle, description, videoUrl, videoType, backgroundOverlay, buttonText, buttonLink } = req.body;
    
    if (req.isMongoConnected) {
      let heroData = await HeroSection.findOne();
      
      if (!heroData) {
        heroData = new HeroSection();
      }
      
      heroData.title = title || heroData.title;
      heroData.subtitle = subtitle || heroData.subtitle;
      heroData.description = description || heroData.description;
      heroData.videoUrl = videoUrl || heroData.videoUrl;
      heroData.videoType = videoType || heroData.videoType;
      heroData.backgroundOverlay = backgroundOverlay !== undefined ? backgroundOverlay : heroData.backgroundOverlay;
      heroData.buttonText = buttonText || heroData.buttonText;
      heroData.buttonLink = buttonLink || heroData.buttonLink;
      
      await heroData.save();
      
      res.json({
        success: true,
        data: heroData,
        message: 'Hero section updated successfully',
        source: 'database'
      });
    } else {
      // Mock update
      const updatedData = {
        ...mockHeroData,
        title: title || mockHeroData.title,
        subtitle: subtitle || mockHeroData.subtitle,
        description: description || mockHeroData.description,
        videoUrl: videoUrl || mockHeroData.videoUrl,
        videoType: videoType || mockHeroData.videoType,
        backgroundOverlay: backgroundOverlay !== undefined ? backgroundOverlay : mockHeroData.backgroundOverlay,
        buttonText: buttonText || mockHeroData.buttonText,
        buttonLink: buttonLink || mockHeroData.buttonLink
      };
      
      res.json({
        success: true,
        data: updatedData,
        message: 'Hero section updated successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero section',
      error: error.message
    });
  }
});

module.exports = router; 