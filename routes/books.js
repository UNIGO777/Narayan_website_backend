const express = require('express');
const Books = require('../models/Books');
const { requireAuth, requireEditor } = require('../middleware/auth');

const router = express.Router();

// Mock data with original English content
const mockBooksData = {
  sectionInfo: {
    subtitle: 'Sacred Literature',
    title: 'Our Books Collection',
    description: 'Explore our comprehensive collection of spiritual and philosophical books that guide you on your journey of self-discovery and spiritual growth.'
  },
  books: [
    {
      title: 'The Bhagavad Gita',
      author: 'Sage Veda Vyasa',
      description: 'The timeless spiritual classic that contains the essence of Hindu philosophy and the science of self-realization.',
      category: 'Spiritual',
      language: 'Hindi',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: 299,
      isAvailable: true,
      featured: true,
      publishedYear: 2023,
      pages: 320,
      isbn: '978-93-5000-001-1',
      order: 1
    },
    {
      title: 'Vedic Wisdom',
      author: 'Maharshi Dayananda',
      description: 'A comprehensive guide to understanding the ancient Vedic traditions and their relevance in modern life.',
      category: 'Philosophy',
      language: 'English',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: 499,
      isAvailable: true,
      featured: true,
      publishedYear: 2023,
      pages: 456,
      isbn: '978-93-5000-002-8',
      order: 2
    },
    {
      title: 'Saints and Sages',
      author: 'Pandit Vishnu Sharma',
      description: 'Biographies of great Indian saints and sages who transformed countless lives through their teachings.',
      category: 'Biography',
      language: 'English',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: 799,
      isAvailable: true,
      featured: false,
      publishedYear: 2021,
      pages: 624,
      isbn: '978-93-5000-006-6',
      order: 6
    }
  ],
  lastUpdated: new Date()
};

// @route   GET /api/books
// @desc    Get books data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📚 Fetching Books data...');
    
    let booksData = await Books.findOne();
    
    if (!booksData) {
      console.log('📚 No Books data found in database, using mock data');
      booksData = mockBooksData;
    }
    
    console.log('📚 Books data fetched successfully');
    res.json({
      success: true,
      data: booksData
    });
  } catch (error) {
    console.error('📚 Error fetching Books data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books data',
      data: mockBooksData
    });
  }
});

// @route   PUT /api/books
// @desc    Update books data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('📚 Updating Books data...');
    const { sectionInfo, books } = req.body;
    
    let booksData = await Books.findOne();
    
    if (!booksData) {
      booksData = new Books({
        sectionInfo,
        books: books || []
      });
    } else {
      booksData.sectionInfo = sectionInfo;
      booksData.books = books || [];
    }
    
    await booksData.save();
    
    console.log('📚 Books data updated successfully');
    res.json({
      success: true,
      message: 'Books data updated successfully',
      data: booksData
    });
  } catch (error) {
    console.error('📚 Error updating Books data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating books data',
      error: error.message
    });
  }
});

// @route   DELETE /api/books
// @desc    Delete books data
// @access  Private (Editor+)
router.delete('/', requireEditor, async (req, res) => {
  try {
    console.log('📚 Deleting Books data...');
    
    await Books.deleteMany({});
    
    console.log('📚 Books data deleted successfully');
    res.json({
      success: true,
      message: 'Books data deleted successfully',
      data: mockBooksData
    });
  } catch (error) {
    console.error('📚 Error deleting Books data:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting books data',
      error: error.message
    });
  }
});

// @route   GET /api/books/categories
// @desc    Get all available book categories
// @access  Public
router.get('/categories', (req, res) => {
  try {
    const categories = ['Spiritual', 'Philosophy', 'History', 'Biography', 'Religious', 'Meditation', 'Yoga', 'Other'];
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('📚 Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// @route   GET /api/books/languages
// @desc    Get all available languages
// @access  Public
router.get('/languages', (req, res) => {
  try {
    const languages = ['Hindi', 'English', 'Sanskrit', 'Mixed'];
    res.json({
      success: true,
      data: languages
    });
  } catch (error) {
    console.error('📚 Error fetching languages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching languages',
      error: error.message
    });
  }
});

module.exports = router; 