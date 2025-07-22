const express = require('express');
const router = express.Router();
const VipVisits = require('../models/VipVisits');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data fallback
const mockData = {
  sectionInfo: {
    subtitle: "DIVINE VISITS",
    title: "Distinguished Visitors",
    description: "Honoring the sacred presence of revered saints and spiritual leaders who have blessed our temple"
  },
  visits: [
    {
      _id: "1",
      name: 'Pujya Swami Maharaj',
      date: 'January 15, 2023',
      description: 'Blessed our temple with divine presence and performed special puja ceremonies',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2070&auto=format&fit=crop'
    },
    {
      _id: "2",
      name: 'Sant Shri Morari Bapu',
      date: 'March 12, 2023',
      description: 'Graced the temple with spiritual discourse and blessed all devotees',
      image: 'https://images.unsplash.com/photo-1604605801370-3396f9bd9ba0?q=80&w=2070&auto=format&fit=crop'
    },
    {
      _id: "3",
      name: 'Pujya Ramesh Bhai Oza',
      date: 'September 5, 2023',
      description: 'Conducted special prayers and shared divine knowledge with devotees',
      image: 'https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=2070&auto=format&fit=crop'
    }
  ]
};

// GET - Fetch VIP Visits data
router.get('/', async (req, res) => {
  try {
    let data = await VipVisits.findOne();
    
    if (!data) {
      console.log('No data found in database, using mock data');
      data = mockData;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching VIP Visits data:', error);
    res.json(mockData);
  }
});

// PUT - Update VIP Visits data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { sectionInfo, visits } = req.body;
    
    // Filter out invalid _id fields from visits (for new visits or mock data)
    const cleanedVisits = visits.map(visit => {
      const cleanedVisit = { ...visit };
      // Remove _id if it's not a valid MongoDB ObjectId (24 characters, hexadecimal)
      if (cleanedVisit._id && !/^[0-9a-fA-F]{24}$/.test(cleanedVisit._id)) {
        delete cleanedVisit._id;
      }
      return cleanedVisit;
    });
    
    let data = await VipVisits.findOne();
    
    if (data) {
      // Update existing document
      data.sectionInfo = sectionInfo;
      data.visits = cleanedVisits;
      await data.save();
    } else {
      // Create new document
      data = new VipVisits({
        sectionInfo,
        visits: cleanedVisits
      });
      await data.save();
    }
    
    res.json({ message: 'VIP Visits data updated successfully', data });
  } catch (error) {
    console.error('Error updating VIP Visits data:', error);
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

module.exports = router; 