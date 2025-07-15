const express = require('express');
const { body, validationResult } = require('express-validator');
const Navigation = require('../models/Navigation');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/navigation
// @desc    Get all navigation menus
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = { isActive: true };
    if (type) filter.type = type;

    const navigation = await Navigation.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: navigation.length,
      navigation
    });

  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/navigation/:id
// @desc    Get single navigation menu
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const navigation = await Navigation.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!navigation) {
      return res.status(404).json({
        success: false,
        message: 'Navigation not found'
      });
    }

    res.json({
      success: true,
      navigation
    });

  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/navigation
// @desc    Create new navigation menu
// @access  Private (Editor)
router.post('/', [
  requireAuth,
  requireEditor,
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('type').isIn(['main', 'footer', 'mobile', 'sidebar']),
  body('items').isArray()
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

    const navigationData = {
      ...req.body,
      createdBy: req.user._id
    };

    const navigation = new Navigation(navigationData);
    await navigation.save();

    await navigation.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Navigation created successfully',
      navigation
    });

  } catch (error) {
    console.error('Create navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/navigation/:id
// @desc    Update navigation menu
// @access  Private (Editor)
router.put('/:id', [
  requireAuth,
  requireEditor,
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('type').optional().isIn(['main', 'footer', 'mobile', 'sidebar']),
  body('items').optional().isArray(),
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

    const navigation = await Navigation.findById(req.params.id);
    if (!navigation) {
      return res.status(404).json({
        success: false,
        message: 'Navigation not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        navigation[key] = req.body[key];
      }
    });

    navigation.lastModifiedBy = req.user._id;
    await navigation.save();

    await navigation.populate(['createdBy', 'lastModifiedBy'], 'name email');

    res.json({
      success: true,
      message: 'Navigation updated successfully',
      navigation
    });

  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/navigation/:id
// @desc    Delete navigation menu
// @access  Private (Editor)
router.delete('/:id', [requireAuth, requireEditor], async (req, res) => {
  try {
    const navigation = await Navigation.findById(req.params.id);
    if (!navigation) {
      return res.status(404).json({
        success: false,
        message: 'Navigation not found'
      });
    }

    await Navigation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Navigation deleted successfully'
    });

  } catch (error) {
    console.error('Delete navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 