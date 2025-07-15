const express = require('express');
const router = express.Router();
const SpritualGrowth = require('../models/SpritualGrowth');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockSpritualGrowthData = {
  title: "आध्यात्मिक विकास",
  description: "आध्यात्मिक विकास के लिए हमारे साथ जुड़ें और अपने जीवन को नई दिशा दें।",
  shortDescription: "This is the Jyotiswaroop Darbar (Abode) of Shree Sadguru Narayan Swami. Shri Sidh Narayan Tekdi, nestled in the divine land of Ramtek, is not just a hill—it is a sacred living presence, a beacon of spiritual light, awakened and sanctified by the eternal Sanjeevan Samadhi of Shree Sadguru Narayan Swami...",
  images: {
    leftColumn: {
      image1: 'https://images.unsplash.com/photo-1719465236914-71562b2c59dd?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      image2: 'https://images.unsplash.com/photo-1682949353534-ff912cafd3b1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    rightColumn: {
      mainImage: 'https://plus.unsplash.com/premium_photo-1692102550620-35f8716814b4?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      topImage: 'https://images.unsplash.com/photo-1716117626586-538233aaf9ae?q=80&w=2755&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bottomImage: 'https://images.unsplash.com/photo-1593014109521-48ea09f22592?q=80&w=1000&auto=format&fit=crop'
    }
  }
};

// GET - Get spiritual growth data
router.get('/', async (req, res) => {
  try {
    let spritualGrowth = await SpritualGrowth.findOne();
    
    if (!spritualGrowth) {
      spritualGrowth = mockSpritualGrowthData;
    }
    
    res.json(spritualGrowth);
  } catch (error) {
    console.error('Error fetching spiritual growth data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch spiritual growth data',
      details: error.message 
    });
  }
});

// PUT - Update spiritual growth data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      shortDescription,
      images 
    } = req.body;

    let spritualGrowth = await SpritualGrowth.findOne();
    
    if (!spritualGrowth) {
      // Create new document if none exists
      spritualGrowth = new SpritualGrowth({
        title,
        description,
        shortDescription,
        images
      });
    } else {
      // Update existing document
      spritualGrowth.title = title || spritualGrowth.title;
      spritualGrowth.description = description || spritualGrowth.description;
      spritualGrowth.shortDescription = shortDescription || spritualGrowth.shortDescription;
      
      if (images) {
        if (images.leftColumn) {
          spritualGrowth.images.leftColumn = {
            ...spritualGrowth.images.leftColumn,
            ...images.leftColumn
          };
        }
        if (images.rightColumn) {
          spritualGrowth.images.rightColumn = {
            ...spritualGrowth.images.rightColumn,
            ...images.rightColumn
          };
        }
      }
    }
    
    await spritualGrowth.save();
    res.json(spritualGrowth);
  } catch (error) {
    console.error('Error updating spiritual growth data:', error);
    res.status(500).json({ 
      error: 'Failed to update spiritual growth data',
      details: error.message 
    });
  }
});

// DELETE - Delete spiritual growth data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await SpritualGrowth.deleteMany({});
    res.json({ message: 'Spiritual growth data reset to defaults' });
  } catch (error) {
    console.error('Error resetting spiritual growth data:', error);
    res.status(500).json({ 
      error: 'Failed to reset spiritual growth data',
      details: error.message 
    });
  }
});

module.exports = router; 