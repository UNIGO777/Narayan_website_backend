const express = require('express');
const router = express.Router();
const MaharajTapostalPlaces = require('../models/MaharajTapostalPlaces');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data fallback
const mockData = {
  sectionInfo: {
    title: "Maharaj Tapostal Places",
    subtitle: "Sacred places where Maharaj spent time in meditation and spiritual practices"
  },
  places: [
    {
      _id: "1",
      title: "Narayan Sarovar",
      subtitle: "Sacred Place",
      description: "Narayan Sarovar is one of the most sacred places where Maharaj spent significant time in meditation and spiritual practices. The serene environment and divine atmosphere make it a perfect place for spiritual seekers.",
      image: "https://images.unsplash.com/photo-1743588239716-69ec9b088a68?q=80&w=3472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Gujarat, India"
    },
    {
      _id: "2",
      title: "Gadhada Temple",
      subtitle: "Historical Site",
      description: "The Gadhada Temple holds immense historical significance as it was one of Maharaj's favorite places for conducting spiritual discourses. The temple architecture and surroundings reflect the rich cultural heritage.",
      image: "https://images.unsplash.com/photo-1743588240036-6ce1b606f5ed?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Gadhada, Gujarat"
    }
  ]
};

// GET - Fetch Maharaj Tapostal Places data
router.get('/', async (req, res) => {
  try {
    let data = await MaharajTapostalPlaces.findOne();
    
    if (!data) {
      console.log('No data found in database, using mock data');
      data = mockData;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching Maharaj Tapostal Places data:', error);
    res.json(mockData);
  }
});

// PUT - Update Maharaj Tapostal Places data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { sectionInfo, places } = req.body;
    
    // Filter out invalid _id fields from places (for new places or mock data)
    const cleanedPlaces = places.map(place => {
      const cleanedPlace = { ...place };
      // Remove _id if it's not a valid MongoDB ObjectId (24 characters, hexadecimal)
      if (cleanedPlace._id && !/^[0-9a-fA-F]{24}$/.test(cleanedPlace._id)) {
        delete cleanedPlace._id;
      }
      return cleanedPlace;
    });
    
    let data = await MaharajTapostalPlaces.findOne();
    
    if (data) {
      // Update existing document
      data.sectionInfo = sectionInfo;
      data.places = cleanedPlaces;
      await data.save();
    } else {
      // Create new document
      data = new MaharajTapostalPlaces({
        sectionInfo,
        places: cleanedPlaces
      });
      await data.save();
    }
    
    res.json({ message: 'Maharaj Tapostal Places data updated successfully', data });
  } catch (error) {
    console.error('Error updating Maharaj Tapostal Places data:', error);
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

module.exports = router; 