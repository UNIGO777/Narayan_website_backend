const express = require('express');
const { body, validationResult } = require('express-validator');
const Social = require('../models/Social');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/social
// @desc    Get all social media links
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { platform, active } = req.query;
    
    const filter = {};
    if (platform) filter.platform = platform;
    if (active !== undefined) filter.isActive = active === 'true';

    const socialLinks = await Social.find(filter)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: socialLinks.length,
      socialLinks
    });

  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/social/:id
// @desc    Get single social media link
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const social = await Social.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    res.json({
      success: true,
      social
    });

  } catch (error) {
    console.error('Get social link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/social
// @desc    Create new social media link
// @access  Private (Editor)
router.post('/', [
  requireAuth,
  requireEditor,
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('platform').isIn([
    'facebook', 'instagram', 'twitter', 'youtube', 'linkedin',
    'pinterest', 'telegram', 'whatsapp', 'tiktok', 'snapchat', 'discord', 'other'
  ]),
  body('url').isURL(),
  body('username').optional().trim(),
  body('displayName').optional().trim(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  body('followers').optional().isInt({ min: 0 }),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const socialData = {
      ...req.body,
      createdBy: req.user._id
    };

    const social = new Social(socialData);
    await social.save();

    await social.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Social link created successfully',
      social
    });

  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/social/:id
// @desc    Update social media link
// @access  Private (Editor)
router.put('/:id', [
  requireAuth,
  requireEditor,
  body('name').optional().trim().isLength({ min: 1, max: 50 }),
  body('platform').optional().isIn([
    'facebook', 'instagram', 'twitter', 'youtube', 'linkedin',
    'pinterest', 'telegram', 'whatsapp', 'tiktok', 'snapchat', 'discord', 'other'
  ]),
  body('url').optional().isURL(),
  body('username').optional().trim(),
  body('displayName').optional().trim(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  body('followers').optional().isInt({ min: 0 }),
  body('order').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const social = await Social.findById(req.params.id);
    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        social[key] = req.body[key];
      }
    });

    social.lastModifiedBy = req.user._id;
    await social.save();

    await social.populate(['createdBy', 'lastModifiedBy'], 'name email');

    res.json({
      success: true,
      message: 'Social link updated successfully',
      social
    });

  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/social/:id
// @desc    Delete social media link
// @access  Private (Editor)
router.delete('/:id', [requireAuth, requireEditor], async (req, res) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    await Social.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Social link deleted successfully'
    });

  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/social/:id/click
// @desc    Track social media link click
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    // Update click analytics
    social.analytics.clicks += 1;
    social.analytics.lastClicked = new Date();

    // Update monthly clicks
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const monthlyClick = social.analytics.monthlyClicks.find(mc => mc.month === currentMonth);
    
    if (monthlyClick) {
      monthlyClick.clicks += 1;
    } else {
      social.analytics.monthlyClicks.push({
        month: currentMonth,
        clicks: 1
      });
    }

    await social.save();

    res.json({
      success: true,
      message: 'Click tracked successfully'
    });

  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 