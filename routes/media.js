const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Media = require('../models/Media');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// Mock media store for when MongoDB is not available
const mockMediaStore = [
  {
    _id: 'mock-media-1',
    title: 'Temple Image 1',
    originalName: 'temple-main.jpg',
    filename: 'temple-main.jpg',
    url: '/uploads/temple-main.jpg',
    mimetype: 'image/jpeg',
    size: 1024000,
    category: 'temple',
    alt: 'Main temple building',
    description: 'Beautiful view of the main temple',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'mock-media-2',
    title: 'Deity Image',
    originalName: 'deity.jpg',
    filename: 'deity.jpg',
    url: '/uploads/deity.jpg',
    mimetype: 'image/jpeg',
    size: 856000,
    category: 'deity',
    alt: 'Sacred deity image',
    description: 'Sacred image of the deity',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'mock-media-3',
    title: 'Festival Image',
    originalName: 'festival.jpg',
    filename: 'festival.jpg',
    url: '/uploads/festival.jpg',
    mimetype: 'image/jpeg',
    size: 1200000,
    category: 'events',
    alt: 'Festival celebration',
    description: 'Community celebrating festival',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'mock-media-4',
    title: 'Spiritual Guru',
    originalName: 'guru.jpg',
    filename: 'guru.jpg',
    url: '/uploads/guru.jpg',
    mimetype: 'image/jpeg',
    size: 945000,
    category: 'guru',
    alt: 'Spiritual teacher',
    description: 'Our revered spiritual teacher',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'mock-media-5',
    title: 'Donation Drive',
    originalName: 'donation.jpg',
    filename: 'donation.jpg',
    url: '/uploads/donation.jpg',
    mimetype: 'image/jpeg',
    size: 780000,
    category: 'donations',
    alt: 'Community donation drive',
    description: 'Community participating in donation drive',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, MP4, and WebM are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to get file category
const getFileCategory = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('document') || mimeType.includes('pdf')) return 'document';
  return 'other';
};

// Helper function to generate thumbnails for images
const generateThumbnails = async (filePath, filename) => {
  try {
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    
    const thumbnailPath = path.join(path.dirname(filePath), `thumb_${nameWithoutExt}.webp`);
    const mediumPath = path.join(path.dirname(filePath), `medium_${nameWithoutExt}.webp`);
    
    await sharp(filePath)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);
      
    await sharp(filePath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(mediumPath);
      
    return {
      thumbnail: `/uploads/thumb_${nameWithoutExt}.webp`,
      medium: `/uploads/medium_${nameWithoutExt}.webp`
    };
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    return {};
  }
};

// @route   GET /api/media
// @desc    Get all media files
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, page = 1, limit = 20, search } = req.query;
    
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      let media = [...mockMediaStore];
      
      // Apply filters
      if (category && category !== 'all') {
        media = media.filter(item => item.category === category);
      }
      if (type) {
        media = media.filter(item => item.mimetype.startsWith(type + '/'));
      }
      if (search) {
        const searchLower = search.toLowerCase();
        media = media.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.originalName.toLowerCase().includes(searchLower) ||
          item.alt?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const skip = (page - 1) * limit;
      const paginatedMedia = media.slice(skip, skip + parseInt(limit));
      
      return res.json({
        success: true,
        count: paginatedMedia.length,
        total: media.length,
        page: parseInt(page),
        pages: Math.ceil(media.length / limit),
        media: paginatedMedia,
        source: 'mock'
      });
    }

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (type) filter.mimetype = new RegExp(`^${type}/`, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { originalName: new RegExp(search, 'i') },
        { alt: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const media = await Media.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Media.countDocuments(filter);

    res.json({
      success: true,
      count: media.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      media,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/media/:id
// @desc    Get single media file
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      // Use mock data when MongoDB is not connected
      const media = mockMediaStore.find(item => item._id === req.params.id);
      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }
      return res.json({
        success: true,
        media,
        source: 'mock'
      });
    }

    const media = await Media.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      media,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/media/upload
// @desc    Upload media files
// @access  Private (Editor+)
router.post('/upload', [requireAuth, requireEditor], upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    if (!req.isMongoConnected) {
      // Mock upload when MongoDB is not connected
      const uploadedFiles = req.files.map((file, index) => ({
        _id: `mock-upload-${Date.now()}-${index}`,
        title: file.originalname,
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        category: getFileCategory(file.mimetype),
        uploadedBy: req.user ? req.user._id : 'mock-user',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      return res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        media: uploadedFiles,
        source: 'mock'
      });
    }

    const uploadedMedia = [];

    for (const file of req.files) {
      let thumbnails = {};
      
      // Generate thumbnails for images
      if (file.mimetype.startsWith('image/')) {
        thumbnails = await generateThumbnails(file.path, file.filename);
      }

      const mediaData = {
        title: file.originalname,
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        category: getFileCategory(file.mimetype),
        uploadedBy: req.user._id,
        ...thumbnails
      };

      const media = new Media(mediaData);
      await media.save();
      await media.populate('uploadedBy', 'name email');
      
      uploadedMedia.push(media);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedMedia.length} file(s) uploaded successfully`,
      media: uploadedMedia,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// @route   PUT /api/media/:id
// @desc    Update media metadata
// @access  Private (Editor+)
router.put('/:id', [
  requireAuth,
  requireEditor,
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('alt').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('category').optional().isIn(['image', 'video', 'audio', 'document', 'other'])
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
      // Mock update when MongoDB is not connected
      const mediaIndex = mockMediaStore.findIndex(item => item._id === req.params.id);
      if (mediaIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }

      mockMediaStore[mediaIndex] = {
        ...mockMediaStore[mediaIndex],
        ...req.body,
        updatedAt: new Date()
      };

      return res.json({
        success: true,
        media: mockMediaStore[mediaIndex],
        source: 'mock'
      });
    }

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    res.json({
      success: true,
      media,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/media/:id
// @desc    Delete media file
// @access  Private (Editor+)
router.delete('/:id', [requireAuth, requireEditor], async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      // Mock delete when MongoDB is not connected
      const mediaIndex = mockMediaStore.findIndex(item => item._id === req.params.id);
      if (mediaIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Media not found'
        });
      }

      mockMediaStore.splice(mediaIndex, 1);

      return res.json({
        success: true,
        message: 'Media deleted successfully',
        source: 'mock'
      });
    }

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete physical files
    try {
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
      
      // Delete thumbnails if they exist
      if (media.thumbnail) {
        const thumbnailPath = path.join(__dirname, '..', media.thumbnail);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
      
      if (media.medium) {
        const mediumPath = path.join(__dirname, '..', media.medium);
        if (fs.existsSync(mediumPath)) {
          fs.unlinkSync(mediumPath);
        }
      }
    } catch (fileError) {
      console.error('Error deleting physical files:', fileError);
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Media deleted successfully',
      source: 'mongodb'
    });

  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 