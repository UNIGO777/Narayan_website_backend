const express = require('express');
const router = express.Router();
const BriefIntroDoc = require('../models/BriefIntroDoc');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockBriefIntroData = {
  sectionInfo: {
    title: "Download Brief Introduction",
    subtitle: "Sacred Documents & Spiritual Guides",
    description: "Explore our comprehensive collection of spiritual documents, introductory guides, and sacred texts. Download these valuable resources to deepen your understanding of our teachings and practices."
  },
  documents: [
    {
      id: 1,
      title: "Temple Introduction Guide",
      description: "A comprehensive introduction to our temple, its history, traditions, and spiritual practices. Perfect for new devotees and visitors.",
      frontPageImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "https://drive.google.com/file/d/1example123/view?usp=sharing",
      fileSize: "2.5 MB",
      pages: 24,
      language: "Hindi & English",
      category: "Introduction",
      author: "Temple Administration",
      publishedDate: "2024-01-15",
      downloads: 1250,
      featured: true,
      tags: ["Introduction", "History", "Practices"],
      isActive: true,
      order: 1
    },
    {
      id: 2,
      title: "Daily Prayer & Rituals Guide",
      description: "Step-by-step guide for daily prayers, morning rituals, and evening aarti. Includes Sanskrit mantras with Hindi translations.",
      frontPageImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "https://drive.google.com/file/d/2example456/view?usp=sharing",
      fileSize: "1.8 MB",
      pages: 18,
      language: "Hindi & Sanskrit",
      category: "Rituals",
      author: "Pandit Ji",
      publishedDate: "2024-02-10",
      downloads: 890,
      featured: false,
      tags: ["Prayer", "Rituals", "Mantras"],
      isActive: true,
      order: 2
    },
    {
      id: 3,
      title: "Spiritual Philosophy & Teachings",
      description: "Core philosophical teachings and spiritual wisdom from our Guruji. Essential reading for spiritual seekers and devotees.",
      frontPageImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "https://drive.google.com/file/d/3example789/view?usp=sharing",
      fileSize: "3.2 MB",
      pages: 32,
      language: "Hindi",
      category: "Philosophy",
      author: "Sri Narayan Swami",
      publishedDate: "2024-03-05",
      downloads: 2150,
      featured: true,
      tags: ["Philosophy", "Teachings", "Wisdom"],
      isActive: true,
      order: 3
    }
  ]
};

// Helper function to clean document data
const cleanDocumentData = (documents) => {
  return documents.map(document => {
    const cleanedDocument = { ...document };
    
    // Remove _id if it's not a valid ObjectId (e.g., temporary numeric IDs)
    if (cleanedDocument._id && (
      typeof cleanedDocument._id === 'number' || 
      (typeof cleanedDocument._id === 'string' && cleanedDocument._id.match(/^\d+$/))
    )) {
      delete cleanedDocument._id;
    }
    
    // Also clean the id field if it exists and is numeric
    if (cleanedDocument.id && typeof cleanedDocument.id === 'number') {
      delete cleanedDocument.id;
    }
    
    return cleanedDocument;
  });
};

// @route   GET /api/brief-intro-docs
// @desc    Get brief intro documents data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📚 Fetching Brief Intro Documents data...');
    
    let briefIntroData = await BriefIntroDoc.findOne();
    
    if (!briefIntroData) {
      console.log('📝 No brief intro data found, using mock data');
      briefIntroData = mockBriefIntroData;
    }
    
    console.log('✅ Brief intro documents data fetched successfully');
    res.json({
      success: true,
      message: 'Brief intro documents data fetched successfully',
      data: briefIntroData
    });
  } catch (error) {
    console.error('❌ Error fetching brief intro documents data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brief intro documents data',
      data: mockBriefIntroData,
      error: error.message
    });
  }
});

// @route   PUT /api/brief-intro-docs
// @desc    Update brief intro documents data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('📚 Updating Brief Intro Documents data...');
    const { sectionInfo, documents } = req.body;

    let briefIntroData = await BriefIntroDoc.findOne();

    if (!briefIntroData) {
      // Create new document if none exists
      const cleanedDocuments = documents ? cleanDocumentData(documents) : [];
      
      briefIntroData = new BriefIntroDoc({
        sectionInfo,
        documents: cleanedDocuments
      });
    } else {
      // Update existing document
      if (sectionInfo) {
        briefIntroData.sectionInfo = {
          ...briefIntroData.sectionInfo,
          ...sectionInfo
        };
      }
      if (documents) {
        const cleanedDocuments = cleanDocumentData(documents);
        briefIntroData.documents = cleanedDocuments;
      }
    }

    await briefIntroData.save();
    
    console.log('✅ Brief intro documents data updated successfully');
    res.json({
      success: true,
      message: 'Brief intro documents data updated successfully',
      data: briefIntroData
    });
  } catch (error) {
    console.error('❌ Error updating brief intro documents data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating brief intro documents data',
      error: error.message
    });
  }
});

// @route   DELETE /api/brief-intro-docs
// @desc    Reset brief intro documents data to defaults
// @access  Private (Editor+)
router.delete('/', requireEditor, async (req, res) => {
  try {
    console.log('📚 Resetting Brief Intro Documents data to defaults...');
    
    await BriefIntroDoc.deleteMany({});
    
    console.log('✅ Brief intro documents data reset successfully');
    res.json({
      success: true,
      message: 'Brief intro documents data reset to defaults successfully',
      data: mockBriefIntroData
    });
  } catch (error) {
    console.error('❌ Error resetting brief intro documents data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting brief intro documents data',
      error: error.message
    });
  }
});

// @route   DELETE /api/brief-intro-docs/:id
// @desc    Delete single document by ID
// @access  Private (Editor+)
router.delete('/:id', requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📚 Deleting Document ${id}...`);
    
    const briefIntroData = await BriefIntroDoc.findOne();
    
    if (!briefIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Brief intro documents data not found'
      });
    }

    // Filter out the document with the specified ID
    briefIntroData.documents = briefIntroData.documents.filter(
      document => document._id.toString() !== id
    );
    
    await briefIntroData.save();

    console.log('✅ Document deleted successfully');
    res.json({
      success: true,
      message: 'Document deleted successfully',
      data: briefIntroData
    });
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
});

// @route   POST /api/brief-intro-docs/download/:id
// @desc    Track document download
// @access  Public
router.post('/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📚 Tracking download for Document ${id}...`);
    
    const briefIntroData = await BriefIntroDoc.findOne();
    
    if (briefIntroData) {
      const document = briefIntroData.documents.find(doc => doc._id.toString() === id);
      if (document) {
        document.downloads += 1;
        await briefIntroData.save();
        console.log(`✅ Download count updated for document: ${document.title}`);
      }
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

// @route   GET /api/brief-intro-docs/:id
// @desc    Get single document by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📚 Fetching Document ${id}...`);
    
    const briefIntroData = await BriefIntroDoc.findOne();
    
    if (!briefIntroData) {
      return res.status(404).json({
        success: false,
        message: 'Brief intro documents data not found'
      });
    }

    const document = briefIntroData.documents.find(doc => doc._id.toString() === id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Document fetched successfully');
    res.json({
      success: true,
      message: 'Document fetched successfully',
      data: document
    });
  } catch (error) {
    console.error('❌ Error fetching document:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching document',
      error: error.message
    });
  }
});

module.exports = router; 