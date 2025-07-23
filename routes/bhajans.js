const express = require('express');
const router = express.Router();
const Bhajan = require('../models/Bhajan');
const { requireAuth, requireEditor } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bhajans/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `bhajan-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock data for fallback
const mockBhajanData = {
  sectionInfo: {
    title: "Our Sacred Bhajan Collection",
    subtitle: "Divine Melodies for Every Soul",
    description: "Explore our carefully curated collection of devotional bhajans, each carrying the essence of spiritual awakening and divine connection."
  },
  bhajans: [
    {
      name: "Om Namah Shivaya",
      description: "A powerful mantra bhajan dedicated to Lord Shiva, bringing peace and spiritual awakening to the listener's heart.",
      image: "/src/assets/godimage.png",
      duration: "8:45",
      category: "Mantras",
      timing: "Morning",
      downloadLink: "https://drive.google.com/file/d/sample1",
      uploadedDate: "2024-01-15",
      isActive: true,
      featured: true,
      likes: 245,
      downloads: 1890,
      playCount: 3450,
      tags: ["Shiva", "Mantra", "Peace", "Meditation"],
      language: "Sanskrit",
      difficulty: "Beginner",
      instruments: ["Harmonium", "Tabla"],
      artist: "Narayan Gurukul",
      composer: "Traditional"
    },
    {
      name: "Hanuman Chalisa",
      description: "The complete 40-verse prayer to Lord Hanuman, sung with traditional melody and devotion.",
      image: "/src/assets/HanumanImage.png",
      duration: "12:30",
      category: "Traditional",
      timing: "Evening",
      downloadLink: "https://drive.google.com/file/d/sample2",
      uploadedDate: "2024-01-20",
      isActive: true,
      featured: false,
      likes: 189,
      downloads: 1456,
      playCount: 2890,
      tags: ["Hanuman", "Chalisa", "Devotion", "Prayer"],
      language: "Hindi",
      difficulty: "Intermediate",
      instruments: ["Harmonium", "Tabla", "Manjira"],
      artist: "Narayan Gurukul",
      composer: "Tulsidas"
    },
    {
      name: "Aarti Kunj Bihari Ki",
      description: "Traditional evening aarti dedicated to Lord Krishna, perfect for daily worship and meditation.",
      image: "/src/assets/godimage.png",
      duration: "6:20",
      category: "Aarti",
      timing: "Evening",
      downloadLink: "https://drive.google.com/file/d/sample3",
      uploadedDate: "2024-01-25",
      isActive: true,
      featured: true,
      likes: 156,
      downloads: 987,
      playCount: 1890,
      tags: ["Krishna", "Aarti", "Evening", "Worship"],
      language: "Hindi",
      difficulty: "Beginner",
      instruments: ["Harmonium", "Tabla"],
      artist: "Narayan Gurukul",
      composer: "Traditional"
    }
  ],
  categories: ["All", "Mantras", "Traditional", "Aarti", "Devotional", "Festival"]
};

// @route   GET /api/bhajans
// @desc    Get all bhajans data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('🎵 Fetching Bhajan Collection data...');
    
    let bhajanData = await Bhajan.findOne();
    
    if (!bhajanData) {
      console.log('📝 No bhajan data found, using mock data');
      bhajanData = mockBhajanData;
    }
    
    console.log('✅ Bhajan collection data fetched successfully');
    res.json({
      success: true,
      message: 'Bhajan collection data fetched successfully',
      data: bhajanData
    });
  } catch (error) {
    console.error('❌ Error fetching bhajan data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bhajan data',
      data: mockBhajanData,
      error: error.message
    });
  }
});

// @route   PUT /api/bhajans
// @desc    Update bhajan collection data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Updating Bhajan Collection data...');
    const updateData = req.body;

    let bhajanData = await Bhajan.findOne();

    if (!bhajanData) {
      // Create new document if none exists
      bhajanData = new Bhajan(updateData);
    } else {
      // Update existing document
      Object.assign(bhajanData, updateData);
    }

    await bhajanData.save();
    
    console.log('✅ Bhajan collection data updated successfully');
    res.json({
      success: true,
      message: 'Bhajan collection data updated successfully',
      data: bhajanData
    });
  } catch (error) {
    console.error('❌ Error updating bhajan data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bhajan data',
      error: error.message
    });
  }
});

// @route   POST /api/bhajans/bhajan
// @desc    Add a new bhajan
// @access  Private (Editor+)
router.post('/bhajan', requireEditor, upload.single('image'), async (req, res) => {
  try {
    console.log('🎵 Adding new bhajan...');
    const bhajanInfo = req.body;

    // Handle image upload
    if (req.file) {
      bhajanInfo.image = `/uploads/bhajans/${req.file.filename}`;
    }

    // Parse tags if they're sent as string
    if (typeof bhajanInfo.tags === 'string') {
      bhajanInfo.tags = bhajanInfo.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Parse instruments if they're sent as string
    if (typeof bhajanInfo.instruments === 'string') {
      bhajanInfo.instruments = bhajanInfo.instruments.split(',').map(inst => inst.trim()).filter(inst => inst);
    }

    let bhajanData = await Bhajan.findOne();
    
    if (!bhajanData) {
      bhajanData = new Bhajan();
    }

    await bhajanData.addBhajan(bhajanInfo);

    console.log('✅ Bhajan added successfully');
    res.json({
      success: true,
      message: 'Bhajan added successfully',
      data: bhajanData
    });
  } catch (error) {
    console.error('❌ Error adding bhajan:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding bhajan',
      error: error.message
    });
  }
});

// @route   PUT /api/bhajans/bhajan/:index
// @desc    Update a specific bhajan by index
// @access  Private (Editor+)
router.put('/bhajan/:index', requireEditor, upload.single('image'), async (req, res) => {
  try {
    console.log('🎵 Updating bhajan...');
    const index = parseInt(req.params.index);
    const updateData = req.body;

    // Handle image upload
    if (req.file) {
      updateData.image = `/uploads/bhajans/${req.file.filename}`;
    }

    // Parse tags if they're sent as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Parse instruments if they're sent as string
    if (typeof updateData.instruments === 'string') {
      updateData.instruments = updateData.instruments.split(',').map(inst => inst.trim()).filter(inst => inst);
    }

    const bhajanData = await Bhajan.findOne();
    
    if (!bhajanData) {
      return res.status(404).json({
        success: false,
        message: 'Bhajan collection not found'
      });
    }

    await bhajanData.updateBhajanByIndex(index, updateData);

    console.log('✅ Bhajan updated successfully');
    res.json({
      success: true,
      message: 'Bhajan updated successfully',
      data: bhajanData
    });
  } catch (error) {
    console.error('❌ Error updating bhajan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bhajan',
      error: error.message
    });
  }
});

// @route   DELETE /api/bhajans/bhajan/:index
// @desc    Delete a specific bhajan by index
// @access  Private (Editor+)
router.delete('/bhajan/:index', requireEditor, async (req, res) => {
  try {
    console.log('🎵 Deleting bhajan...');
    const index = parseInt(req.params.index);

    const bhajanData = await Bhajan.findOne();
    
    if (!bhajanData) {
      return res.status(404).json({
        success: false,
        message: 'Bhajan collection not found'
      });
    }

    await bhajanData.deleteBhajanByIndex(index);

    console.log('✅ Bhajan deleted successfully');
    res.json({
      success: true,
      message: 'Bhajan deleted successfully',
      data: bhajanData
    });
  } catch (error) {
    console.error('❌ Error deleting bhajan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bhajan',
      error: error.message
    });
  }
});

// @route   GET /api/bhajans/category/:category
// @desc    Get bhajans by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    console.log('🎵 Fetching bhajans by category...');
    const { category } = req.params;

    const bhajans = await Bhajan.getBhajansByCategory(category);

    console.log('✅ Bhajans by category fetched successfully');
    res.json({
      success: true,
      message: 'Bhajans by category fetched successfully',
      data: bhajans
    });
  } catch (error) {
    console.error('❌ Error fetching bhajans by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bhajans by category',
      error: error.message
    });
  }
});

// @route   GET /api/bhajans/featured
// @desc    Get featured bhajans
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    console.log('🎵 Fetching featured bhajans...');
    
    const bhajanData = await Bhajan.findOne();
    
    if (!bhajanData) {
      return res.json({
        success: true,
        message: 'No featured bhajans found',
        data: []
      });
    }

    const featuredBhajans = bhajanData.getFeaturedBhajans();

    console.log('✅ Featured bhajans fetched successfully');
    res.json({
      success: true,
      message: 'Featured bhajans fetched successfully',
      data: featuredBhajans
    });
  } catch (error) {
    console.error('❌ Error fetching featured bhajans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured bhajans',
      error: error.message
    });
  }
});

// @route   POST /api/bhajans/bhajan/:index/download
// @desc    Track bhajan download by index
// @access  Public
router.post('/bhajan/:index/download', async (req, res) => {
  try {
    console.log('🎵 Tracking bhajan download...');
    const index = parseInt(req.params.index);

    const bhajanData = await Bhajan.findOne();
    
    if (bhajanData && bhajanData.bhajans[index]) {
      bhajanData.bhajans[index].downloads += 1;
      await bhajanData.save();
      console.log('✅ Download tracked successfully');
    }

    res.json({
      success: true,
      message: 'Download tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking download:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking download',
      error: error.message
    });
  }
});

// @route   POST /api/bhajans/bhajan/:index/play
// @desc    Track bhajan play by index
// @access  Public
router.post('/bhajan/:index/play', async (req, res) => {
  try {
    console.log('🎵 Tracking bhajan play...');
    const index = parseInt(req.params.index);

    const bhajanData = await Bhajan.findOne();
    
    if (bhajanData && bhajanData.bhajans[index]) {
      bhajanData.bhajans[index].playCount += 1;
      await bhajanData.save();
      console.log('✅ Play tracked successfully');
    }

    res.json({
      success: true,
      message: 'Play tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking play:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking play',
      error: error.message
    });
  }
});

// @route   POST /api/bhajans/bhajan/:index/like
// @desc    Toggle bhajan like by index
// @access  Public
router.post('/bhajan/:index/like', async (req, res) => {
  try {
    console.log('🎵 Toggling bhajan like...');
    const index = parseInt(req.params.index);
    const { action } = req.body; // 'like' or 'unlike'

    const bhajanData = await Bhajan.findOne();
    
    if (bhajanData && bhajanData.bhajans[index]) {
      if (action === 'like') {
        bhajanData.bhajans[index].likes += 1;
      } else if (action === 'unlike' && bhajanData.bhajans[index].likes > 0) {
        bhajanData.bhajans[index].likes -= 1;
      }
      await bhajanData.save();
      console.log('✅ Like toggled successfully');
    }

    res.json({
      success: true,
      message: 'Like toggled successfully'
    });
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

module.exports = router; 