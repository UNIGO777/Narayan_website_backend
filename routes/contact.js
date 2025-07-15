const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/contact
// @desc    Get all contact information
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = { isActive: true };
    if (type) filter.type = type;

    const contacts = await Contact.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      contacts
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact information
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/contact
// @desc    Create new contact information
// @access  Private (Editor)
router.post('/', [
  requireAuth,
  requireEditor,
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('type').isIn(['main', 'secondary', 'branch', 'emergency']),
  body('addresses').optional().isArray(),
  body('phones').optional().isArray(),
  body('emails').optional().isArray(),
  body('hours').optional().isArray()
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

    const contactData = {
      ...req.body,
      createdBy: req.user._id
    };

    const contact = new Contact(contactData);
    await contact.save();

    await contact.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      contact
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/contact/:id
// @desc    Update contact information
// @access  Private (Editor)
router.put('/:id', [
  requireAuth,
  requireEditor,
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('type').optional().isIn(['main', 'secondary', 'branch', 'emergency']),
  body('addresses').optional().isArray(),
  body('phones').optional().isArray(),
  body('emails').optional().isArray(),
  body('hours').optional().isArray(),
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

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        contact[key] = req.body[key];
      }
    });

    contact.lastModifiedBy = req.user._id;
    await contact.save();

    await contact.populate(['createdBy', 'lastModifiedBy'], 'name email');

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact information
// @access  Private (Editor)
router.delete('/:id', [requireAuth, requireEditor], async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 