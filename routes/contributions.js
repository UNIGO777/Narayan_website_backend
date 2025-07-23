const express = require('express');
const router = express.Router();
const Contributions = require('../models/Contributions');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockContributionsData = {
  sectionInfo: {
    title: "What You Can Contribute",
    subtitle: "Support Our Sacred Mission",
    description: "Your contributions help us serve the community and spread spiritual knowledge. Every contribution, big or small, makes a difference in our divine mission."
  },
  contributions: [
    {
      id: 1,
      title: "All General Hall",
      description: "Support the construction and maintenance of our community halls for gatherings, events, and spiritual programs.",
      icon: "Building",
      category: "Infrastructure",
      items: [
        "Main Assembly Hall",
        "Prayer Hall",
        "Community Meeting Space",
        "Event Venue"
      ],
      featured: true,
      isActive: true,
      order: 1
    },
    {
      id: 2,
      title: "Regular Dress",
      description: "Contribute traditional clothing for temple ceremonies and daily spiritual practices.",
      icon: "Shirt",
      category: "Clothing",
      items: [
        {
          name: "Lungi",
          description: "Traditional lower garment for temple services"
        },
        {
          name: "Bandi",
          description: "Traditional vest for ceremonial occasions"
        },
        {
          name: "Topi",
          description: "Sacred headwear for prayers and rituals"
        },
        {
          name: "Pancha",
          description: "Traditional cloth for temple ceremonies"
        }
      ],
      featured: false,
      isActive: true,
      order: 2
    },
    {
      id: 3,
      title: "Types of Seva",
      description: "Participate in various forms of selfless service to support our temple community and spiritual activities.",
      icon: "HandHeart",
      category: "Service",
      items: [
        "Kitchen Seva (Food preparation)",
        "Temple Cleaning Seva",
        "Garden Maintenance",
        "Event Organization",
        "Teaching & Education",
        "Medical Services"
      ],
      featured: false,
      isActive: true,
      order: 3
    },
    {
      id: 4,
      title: "Living Arrangements",
      description: "Support accommodation facilities exclusively for darbar karyakartas (temple workers) who dedicate their lives to service.",
      icon: "Home",
      category: "Accommodation",
      items: [
        "Basic Room Facilities",
        "Shared Kitchen Access",
        "Study/Meditation Space",
        "Utilities & Maintenance"
      ],
      featured: false,
      restriction: "Only for Darbar Karyakartas",
      isActive: true,
      order: 4
    }
  ]
};

// @route   GET /api/contributions
// @desc    Get contributions data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('🤝 Fetching Contributions data...');
    
    let contributionsData = await Contributions.findOne();
    
    if (!contributionsData) {
      console.log('📝 No contributions data found, using mock data');
      contributionsData = mockContributionsData;
    }
    
    console.log('✅ Contributions data fetched successfully');
    res.json({
      success: true,
      message: 'Contributions data fetched successfully',
      data: contributionsData
    });
  } catch (error) {
    console.error('❌ Error fetching contributions data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contributions data',
      data: mockContributionsData,
      error: error.message
    });
  }
});

// Helper function to clean contribution data
const cleanContributionData = (contributions) => {
  return contributions.map(contribution => {
    const cleanedContribution = { ...contribution };
    
    // Remove _id if it's not a valid ObjectId (e.g., temporary numeric IDs)
    if (cleanedContribution._id && (
      typeof cleanedContribution._id === 'number' || 
      (typeof cleanedContribution._id === 'string' && cleanedContribution._id.match(/^\d+$/))
    )) {
      delete cleanedContribution._id;
    }
    
    // Also clean the id field if it exists and is numeric
    if (cleanedContribution.id && typeof cleanedContribution.id === 'number') {
      delete cleanedContribution.id;
    }
    
    return cleanedContribution;
  });
};

// @route   PUT /api/contributions
// @desc    Update contributions data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('🤝 Updating Contributions data...');
    const { sectionInfo, contributions } = req.body;

    let contributionsData = await Contributions.findOne();

    if (!contributionsData) {
      // Create new document if none exists
      const cleanedContributions = contributions ? cleanContributionData(contributions) : [];
      
      contributionsData = new Contributions({
        sectionInfo,
        contributions: cleanedContributions
      });
    } else {
      // Update existing document
      if (sectionInfo) {
        contributionsData.sectionInfo = {
          ...contributionsData.sectionInfo,
          ...sectionInfo
        };
      }
      if (contributions) {
        const cleanedContributions = cleanContributionData(contributions);
        contributionsData.contributions = cleanedContributions;
      }
    }

    await contributionsData.save();
    
    console.log('✅ Contributions data updated successfully');
    res.json({
      success: true,
      message: 'Contributions data updated successfully',
      data: contributionsData
    });
  } catch (error) {
    console.error('❌ Error updating contributions data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contributions data',
      error: error.message
    });
  }
});

// @route   DELETE /api/contributions
// @desc    Delete contributions data (reset to defaults)
// @access  Private (Editor+)
router.delete('/', requireEditor, async (req, res) => {
  try {
    console.log('🤝 Resetting Contributions data to defaults...');
    
    await Contributions.deleteMany({});
    
    console.log('✅ Contributions data reset successfully');
    res.json({
      success: true,
      message: 'Contributions data reset to defaults successfully',
      data: mockContributionsData
    });
  } catch (error) {
    console.error('❌ Error resetting contributions data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting contributions data',
      error: error.message
    });
  }
});

// @route   DELETE /api/contributions/:id
// @desc    Delete single contribution by ID
// @access  Private (Editor+)
router.delete('/:id', requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🤝 Deleting Contribution ${id}...`);
    
    const contributionsData = await Contributions.findOne();
    
    if (!contributionsData) {
      return res.status(404).json({
        success: false,
        message: 'Contributions data not found'
      });
    }

    // Filter out the contribution with the specified ID
    contributionsData.contributions = contributionsData.contributions.filter(
      contribution => contribution._id.toString() !== id
    );
    
    await contributionsData.save();

    console.log('✅ Contribution deleted successfully');
    res.json({
      success: true,
      message: 'Contribution deleted successfully',
      data: contributionsData
    });
  } catch (error) {
    console.error('❌ Error deleting contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contribution',
      error: error.message
    });
  }
});

// @route   GET /api/contributions/:id
// @desc    Get single contribution by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🤝 Fetching Contribution ${id}...`);
    
    const contributionsData = await Contributions.findOne();
    
    if (!contributionsData) {
      return res.status(404).json({
        success: false,
        message: 'Contributions data not found'
      });
    }

    const contribution = contributionsData.contributions.find(c => c._id.toString() === id);
    
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    console.log('✅ Contribution fetched successfully');
    res.json({
      success: true,
      message: 'Contribution fetched successfully',
      data: contribution
    });
  } catch (error) {
    console.error('❌ Error fetching contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contribution',
      error: error.message
    });
  }
});

module.exports = router; 