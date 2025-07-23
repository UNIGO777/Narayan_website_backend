const express = require('express');
const router = express.Router();
const { GalleryImage, GalleryHero } = require('../models/Gallery');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockGalleryImages = [
  {
    id: '1',
    title: 'मंदिर उत्सव',
    description: 'वार्षिक मंदिर उत्सव के दौरान भक्तों का समारोह',
    imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=2069&auto=format&fit=crop',
    category: 'उत्सव',
    date: '2023-04-15',
    featured: true
  },
  {
    id: '2',
    title: 'प्रसाद वितरण',
    description: 'भक्तों के बीच प्रसाद वितरण समारोह',
    imageUrl: 'https://images.unsplash.com/photo-1564923630403-2284b87c0041?q=80&w=2073&auto=format&fit=crop',
    category: 'प्रसाद',
    date: '2023-05-20',
    featured: false
  },
  {
    id: '3',
    title: 'आरती समारोह',
    description: 'सांध्य आरती के दौरान भक्तगण',
    imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2070&auto=format&fit=crop',
    category: 'आरती',
    date: '2023-06-10',
    featured: false
  },
  {
    id: '4',
    title: 'मंदिर परिसर',
    description: 'सुंदर मंदिर परिसर का दृश्य',
    imageUrl: 'https://images.unsplash.com/photo-1568871807338-d2500b3a15c3?q=80&w=2070&auto=format&fit=crop',
    category: 'मंदिर',
    date: '2023-07-05',
    featured: true
  },
  {
    id: '5',
    title: 'गुरुजी का प्रवचन',
    description: 'भक्तों को संबोधित करते गुरुजी',
    imageUrl: 'https://images.unsplash.com/photo-1567850173237-1065be1b2ce2?q=80&w=2072&auto=format&fit=crop',
    category: 'प्रवचन',
    date: '2023-08-12',
    featured: false
  },
  {
    id: '6',
    title: 'भजन संध्या',
    description: 'भक्तिपूर्ण भजन कार्यक्रम',
    imageUrl: 'https://images.unsplash.com/photo-1597336358795-5188d19a0e7a?q=80&w=2070&auto=format&fit=crop',
    category: 'भजन',
    date: '2023-09-18',
    featured: false
  }
];

const mockHeroData = {
  title: 'हमारी तस्वीरों का संग्रह',
  subtitle: 'गतिविधियों और समारोहों की खूबसूरत यादें',
  description: 'इन तस्वीरों के माध्यम से हमारे आश्रम के विविध पहलुओं, समारोहों और भक्तों की गतिविधियों की झलक देखें।',
  backgroundImage: 'https://images.unsplash.com/photo-1627155596311-6cbf18e45356?q=80&w=2072&auto=format&fit=crop'
};

// GET - Get gallery hero data
router.get('/hero', async (req, res) => {
  try {
    let heroData = await GalleryHero.findOne();
    
    if (!heroData) {
      // Use mock data if no data is found
      heroData = mockHeroData;
    }
    
    res.json(heroData);
  } catch (error) {
    console.error('Error fetching gallery hero data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch gallery hero data',
      details: error.message 
    });
  }
});

// PUT - Update gallery hero data
router.put('/hero', requireEditor, async (req, res) => {
  try {
    const { title, subtitle, description, backgroundImage } = req.body;

    let heroData = await GalleryHero.findOne();
    
    if (!heroData) {
      // Create new hero data if none exists
      heroData = new GalleryHero({
        title,
        subtitle,
        description,
        backgroundImage
      });
    } else {
      // Update existing hero data
      heroData.title = title || heroData.title;
      heroData.subtitle = subtitle || heroData.subtitle;
      heroData.description = description || heroData.description;
      heroData.backgroundImage = backgroundImage || heroData.backgroundImage;
    }
    
    await heroData.save();
    res.json(heroData);
  } catch (error) {
    console.error('Error updating gallery hero data:', error);
    res.status(500).json({ 
      error: 'Failed to update gallery hero data',
      details: error.message 
    });
  }
});

// GET - Get gallery images
router.get('/images', async (req, res) => {
  try {
    let images = await GalleryImage.find().sort({ featured: -1, createdAt: -1 });
    
    if (!images || images.length === 0) {
      // Use mock data if no images are found
      res.json({ images: mockGalleryImages });
    } else {
      res.json({ images });
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ 
      error: 'Failed to fetch gallery images',
      details: error.message 
    });
  }
});

// POST - Add a new gallery image
router.post('/images', requireEditor, async (req, res) => {
  try {
    const { title, description, imageUrl, category, date, featured } = req.body;

    const newImage = new GalleryImage({
      title,
      description,
      imageUrl,
      category,
      date,
      featured: featured || false
    });
    
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error adding new gallery image:', error);
    res.status(500).json({ 
      error: 'Failed to add new gallery image',
      details: error.message 
    });
  }
});

// PUT - Update a gallery image
router.put('/images/:id', requireEditor, async (req, res) => {
  try {
    const imageId = req.params.id;
    const { title, description, imageUrl, category, date, featured } = req.body;
    
    // Handle mock data case
    if (mockGalleryImages.some(img => img.id === imageId)) {
      const mockImage = {
        id: imageId,
        title,
        description,
        imageUrl,
        category,
        date,
        featured: featured || false
      };
      
      // Return the updated mock image
      return res.json(mockImage);
    }
    
    // Try to update in the database
    try {
      const updatedImage = await GalleryImage.findByIdAndUpdate(
        imageId,
        {
          title,
          description,
          imageUrl,
          category,
          date,
          featured
        },
        { new: true }
      );
      
      if (!updatedImage) {
        return res.status(404).json({ error: 'Gallery image not found' });
      }
      
      res.json(updatedImage);
    } catch (dbError) {
      // If MongoDB throws an error (like invalid ObjectId), check if we should use mock data
      if (dbError.name === 'CastError' && dbError.kind === 'ObjectId') {
        // Return mock data response
        const mockImage = {
          id: imageId,
          title,
          description,
          imageUrl,
          category,
          date,
          featured: featured || false
        };
        return res.json(mockImage);
      } else {
        throw dbError; // Re-throw if it's a different error
      }
    }
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ 
      error: 'Failed to update gallery image',
      details: error.message 
    });
  }
});

// DELETE - Delete a gallery image
router.delete('/images/:id', requireEditor, async (req, res) => {
  try {
    const imageId = req.params.id;
    
    // Handle mock data case - if using mock data
    if (mockGalleryImages.some(img => img.id === imageId)) {
      // Just return success for mock data
      return res.json({ message: 'Gallery image deleted successfully' });
    }
    
    // Try to delete from the database
    try {
      const deletedImage = await GalleryImage.findByIdAndDelete(imageId);
      
      if (!deletedImage) {
        return res.status(404).json({ error: 'Gallery image not found' });
      }
      
      res.json({ message: 'Gallery image deleted successfully' });
    } catch (dbError) {
      // If MongoDB throws an error (like invalid ObjectId), check if we should use mock data
      if (dbError.name === 'CastError' && dbError.kind === 'ObjectId') {
        // Return success since we might be using mock data
        return res.json({ message: 'Gallery image deleted successfully' });
      } else {
        throw dbError; // Re-throw if it's a different error
      }
    }
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ 
      error: 'Failed to delete gallery image',
      details: error.message 
    });
  }
});

// DELETE - Reset gallery to defaults
router.delete('/reset', requireEditor, async (req, res) => {
  try {
    await GalleryHero.deleteMany({});
    await GalleryImage.deleteMany({});
    res.json({ message: 'Gallery data reset to defaults' });
  } catch (error) {
    console.error('Error resetting gallery data:', error);
    res.status(500).json({ 
      error: 'Failed to reset gallery data',
      details: error.message 
    });
  }
});

module.exports = router; 