const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// Mock data store for when MongoDB is not available
let mockContentStore = {
  'hero-home': {
    _id: 'mock-hero-home',
    title: 'Hero Section',
    section: 'hero-home',
    content: JSON.stringify({
      title: 'श्री सद्गुरु नारायण स्वामी दरबार',
      subtitle: 'श्री सिद्ध नारायण टेकड़ी',
      description: 'Welcome to our sacred space dedicated to spiritual growth and enlightenment.',
      buttonText1: 'Get Started',
      buttonText2: 'Learn More',
      backgroundVideo: '/src/assets/HeroVideo.mp4'
    }),
    excerpt: 'Welcome to our sacred space dedicated to spiritual growth and enlightenment.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'about-us': {
    _id: 'mock-about-us',
    title: 'About Us',
    section: 'about-us',
    content: JSON.stringify({
      title: 'Invest in Your Well-Being and Spiritual Growth',
      description: 'Shree Siddha Narayan Tekdi A BRIEF INTRODUCTION This hill became beautiful by the existence of Sanjeevan Samadhi of Shree Sadguru Narayan Swami.',
      buttonText: 'Learn More',
      image1: '/src/assets/godimage.png',
      image2: '/src/assets/MandirInnerImage.jpeg',
      image3: '/src/assets/HanumanImage.png'
    }),
    excerpt: 'Learn about our sacred temple and spiritual mission.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'our-guruji': {
    _id: 'mock-our-guruji',
    title: 'Our Guruji',
    section: 'our-guruji',
    content: JSON.stringify({
      title: 'Our Respected Gurujis',
      description: 'Learn from our esteemed spiritual teachers who embody the ancient wisdom traditions.',
      cards: [
        { title: 'Spiritual Guide 1', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' },
        { title: 'Spiritual Guide 2', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' },
        { title: 'Spiritual Guide 3', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' },
        { title: 'Spiritual Guide 4', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' },
        { title: 'Spiritual Guide 5', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' },
        { title: 'Spiritual Guide 6', description: 'Guiding devotees on their spiritual journey with wisdom and compassion.' }
      ]
    }),
    excerpt: 'Meet our spiritual guides and teachers.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'rakt-daan': {
    _id: 'mock-rakt-daan',
    title: 'Rakt Daan',
    section: 'rakt-daan',
    content: JSON.stringify({
      title: 'Sankalpa Rakta Daan',
      description: 'Join our sacred mission to save lives through blood donation. Your contribution can make a significant difference.',
      buttonText: 'Register as Donor',
      image: '/src/assets/bloodDonation.jpg'
    }),
    excerpt: 'Join our blood donation initiative.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'sharm-daan': {
    _id: 'mock-sharm-daan',
    title: 'Sharm Daan',
    section: 'sharm-daan',
    content: JSON.stringify({
      title: 'Shram Daan',
      description: 'Contribute your time and skills for temple development and community welfare activities.',
      buttonText: 'Join Now'
    }),
    excerpt: 'Contribute your time and skills.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'anya-daan': {
    _id: 'mock-anya-daan',
    title: 'Anya Daan',
    section: 'anya-daan',
    content: JSON.stringify({
      title: 'Anya Daan',
      description: 'Support our various community initiatives through different forms of donations.',
      buttonText: 'Donate Now'
    }),
    excerpt: 'Support our community initiatives.',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// @route   GET /api/content
// @desc    Get all content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { section, published, page = 1, limit = 10 } = req.query;
    
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      let content = Object.values(mockContentStore);
      
      // Apply filters
      if (section) {
        content = content.filter(item => item.section === section);
      }
      if (published !== undefined) {
        content = content.filter(item => item.isPublished === (published === 'true'));
      }
      
      // Apply pagination
      const skip = (page - 1) * limit;
      const paginatedContent = content.slice(skip, skip + parseInt(limit));
      
      return res.json({
        success: true,
        count: paginatedContent.length,
        total: content.length,
        page: parseInt(page),
        pages: Math.ceil(content.length / limit),
        content: paginatedContent,
        source: 'mock'
      });
    }

    const filter = {};
    if (section) filter.section = section;
    if (published !== undefined) filter.isPublished = published === 'true';

    const skip = (page - 1) * limit;

    const content = await Content.find(filter)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(filter);

    res.json({
      success: true,
      count: content.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      content,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/content/sections
// @desc    Get content grouped by sections
// @access  Public
router.get('/sections', async (req, res) => {
  try {
    const { published } = req.query;
    
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const sections = {};
      Object.values(mockContentStore).forEach(item => {
        if (published === undefined || item.isPublished === (published === 'true')) {
          if (!sections[item.section]) {
            sections[item.section] = [];
          }
          sections[item.section].push(item);
        }
      });
      
      return res.json({
        success: true,
        sections,
        source: 'mock'
      });
    }

    const filter = {};
    if (published !== undefined) filter.isPublished = published === 'true';

    const content = await Content.find(filter)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    // Group by section
    const sections = {};
    content.forEach(item => {
      if (!sections[item.section]) {
        sections[item.section] = [];
      }
      sections[item.section].push(item);
    });

    res.json({
      success: true,
      sections,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const content = Object.values(mockContentStore).find(item => item._id === req.params.id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }
      return res.json({
        success: true,
        content,
        source: 'mock'
      });
    }

    const content = await Content.findById(req.params.id)
      .populate('author', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      content,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/content
// @desc    Create new content
// @access  Private (Editor+)
router.post('/', [
  requireAuth,
  requireEditor,
  body('title').notEmpty().withMessage('Title is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const mockId = `mock-${Date.now()}`;
      const newContent = {
        _id: mockId,
        ...req.body,
        author: req.user ? req.user._id : 'mock-user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockContentStore[req.body.section] = newContent;
      
      return res.status(201).json({
        success: true,
        content: newContent,
        source: 'mock'
      });
    }

    const content = new Content({
      ...req.body,
      author: req.user._id
    });

    await content.save();
    await content.populate('author', 'name email');

    res.status(201).json({
      success: true,
      content,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/content/:id
// @desc    Update content
// @access  Private (Editor+)
router.put('/:id', [
  requireAuth,
  requireEditor,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const existingContent = Object.values(mockContentStore).find(item => item._id === req.params.id);
      if (!existingContent) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }
      
      const updatedContent = {
        ...existingContent,
        ...req.body,
        updatedAt: new Date(),
        lastModifiedBy: req.user ? req.user._id : 'mock-user'
      };
      
      mockContentStore[updatedContent.section] = updatedContent;
      
      return res.json({
        success: true,
        content: updatedContent,
        source: 'mock'
      });
    }

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModifiedBy: req.user._id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email')
     .populate('lastModifiedBy', 'name email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      content,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content
// @access  Private (Editor+)
router.delete('/:id', [requireAuth, requireEditor], async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const content = Object.values(mockContentStore).find(item => item._id === req.params.id);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Content not found'
        });
      }
      
      delete mockContentStore[content.section];
      
      return res.json({
        success: true,
        message: 'Content deleted successfully',
        source: 'mock'
      });
    }

    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully',
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 