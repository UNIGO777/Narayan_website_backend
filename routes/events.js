const express = require('express');
const router = express.Router();
const Events = require('../models/Events');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockEventsData = {
  pageInfo: {
    title: "Upcoming Temple Events",
    description: "Join us for a variety of spiritual, cultural, and community events throughout the year. Our temple hosts regular celebrations, workshops, discourses, and service activities to nurture spiritual growth and community connection."
  },
  categories: [
    {
      id: "spiritual",
      name: "Spiritual Events",
      order: 1
    },
    {
      id: "cultural",
      name: "Cultural Celebrations",
      order: 2
    },
    {
      id: "community",
      name: "Community Service",
      order: 3
    }
  ],
  events: [
    {
      title: "Morning Aarti",
      date: "2024-01-15",
      time: "6:00 AM",
      location: "Main Temple",
      description: "Daily morning prayers and devotional songs to start the day with divine blessings.",
      category: "spiritual",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1470&auto=format&fit=crop",
      order: 1
    },
    {
      title: "Spiritual Discourse",
      date: "2024-01-20",
      time: "7:00 PM",
      location: "Community Hall",
      description: "Weekly spiritual discourse by our respected Guruji on various aspects of spiritual life.",
      category: "spiritual",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop",
      order: 2
    },
    {
      title: "Festival Celebration",
      date: "2024-01-25",
      time: "5:00 PM",
      location: "Temple Grounds",
      description: "Celebration of traditional festivals with cultural programs and community participation.",
      category: "cultural",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1470&auto=format&fit=crop",
      order: 3
    }
  ]
};

// GET - Get Events data
router.get('/', async (req, res) => {
  try {
    let events = await Events.findOne();
    
    if (!events) {
      events = mockEventsData;
    }
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching Events data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Events data',
      details: error.message 
    });
  }
});

// PUT - Update Events data
router.put('/', requireEditor, async (req, res) => {
  try {
    const updateData = req.body;
    
    let events = await Events.findOne();
    
    if (!events) {
      events = new Events(updateData);
    } else {
      Object.assign(events, updateData);
    }
    
    await events.save();
    res.json(events);
  } catch (error) {
    console.error('Error updating Events:', error);
    res.status(500).json({ 
      error: 'Failed to update Events data',
      details: error.message 
    });
  }
});

// DELETE - Delete Events data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await Events.deleteMany({});
    res.json({ message: 'Events data reset to defaults' });
  } catch (error) {
    console.error('Error resetting Events data:', error);
    res.status(500).json({ 
      error: 'Failed to reset Events data',
      details: error.message 
    });
  }
});

module.exports = router; 