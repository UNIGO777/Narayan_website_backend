const express = require('express');
const Content = require('../models/Content');
const Media = require('../models/Media');
const Event = require('../models/Event');
const User = require('../models/User');
const Social = require('../models/Social');
const { requireAuth, requireEditor, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Editor)
router.get('/dashboard', [requireAuth, requireEditor], async (req, res) => {
  try {
    // Get counts
    const totalContent = await Content.countDocuments();
    const publishedContent = await Content.countDocuments({ isPublished: true });
    const totalMedia = await Media.countDocuments();
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ 
      status: 'published', 
      startDate: { $gte: new Date() } 
    });
    const totalUsers = await User.countDocuments();
    const activeSocial = await Social.countDocuments({ isActive: true });

    // Get recent content
    const recentContent = await Content.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent media
    const recentMedia = await Media.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const upcomingEventsList = await Event.find({
      status: 'published',
      startDate: { $gte: new Date() }
    })
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 })
      .limit(5);

    // Get content by section
    const contentBySection = await Content.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$section', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get media by category
    const mediaByCategory = await Media.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        content: {
          total: totalContent,
          published: publishedContent,
          draft: totalContent - publishedContent
        },
        media: {
          total: totalMedia
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents
        },
        users: {
          total: totalUsers
        },
        social: {
          active: activeSocial
        }
      },
      recent: {
        content: recentContent,
        media: recentMedia,
        events: upcomingEventsList
      },
      analytics: {
        contentBySection,
        mediaByCategory,
        eventsByCategory
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/system-info
// @desc    Get system information
// @access  Private (Admin)
router.get('/system-info', [requireAuth, requireAdmin], async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      environment: process.env.NODE_ENV || 'development'
    };

    res.json({
      success: true,
      systemInfo
    });

  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/logs
// @desc    Get application logs (Admin only)
// @access  Private (Admin)
router.get('/logs', [requireAuth, requireAdmin], async (req, res) => {
  try {
    const { level = 'info', limit = 100 } = req.query;
    
    // In a real application, you would implement proper logging
    // For now, return a placeholder response
    res.json({
      success: true,
      logs: [
        {
          level: 'info',
          message: 'Server started successfully',
          timestamp: new Date(),
          userId: req.user._id
        }
      ]
    });

  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/backup
// @desc    Create database backup
// @access  Private (Admin)
router.post('/backup', [requireAuth, requireAdmin], async (req, res) => {
  try {
    // In a real application, you would implement database backup functionality
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Backup created successfully',
      backupId: 'backup_' + Date.now(),
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Editor)
router.get('/analytics', [requireAuth, requireEditor], async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    // Content analytics
    const contentCreated = await Content.countDocuments(dateFilter);
    const contentPublished = await Content.countDocuments({ 
      ...dateFilter, 
      isPublished: true 
    });

    // Media analytics
    const mediaUploaded = await Media.countDocuments(dateFilter);
    const mediaSize = await Media.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);

    // Event analytics
    const eventsCreated = await Event.countDocuments(dateFilter);
    const eventsPublished = await Event.countDocuments({ 
      ...dateFilter, 
      status: 'published' 
    });

    // User analytics
    const usersCreated = await User.countDocuments(dateFilter);

    // Social media analytics
    const socialClicks = await Social.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalClicks: { $sum: '$analytics.clicks' } } }
    ]);

    res.json({
      success: true,
      period,
      analytics: {
        content: {
          created: contentCreated,
          published: contentPublished
        },
        media: {
          uploaded: mediaUploaded,
          totalSize: mediaSize[0]?.totalSize || 0
        },
        events: {
          created: eventsCreated,
          published: eventsPublished
        },
        users: {
          created: usersCreated
        },
        social: {
          totalClicks: socialClicks[0]?.totalClicks || 0
        }
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 