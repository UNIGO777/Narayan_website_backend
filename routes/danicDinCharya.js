const express = require('express');
const router = express.Router();
const DanicDinCharya = require('../models/DanicDinCharya');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockDanicDinCharyaData = {
  title: "दैनिक दिनचर्या",
  description: "आध्यात्मिक विकास के लिए एक अनुशासित दिनचर्या अत्यंत महत्वपूर्ण है। श्री सद्गुरु नारायण स्वामी के अनुयायियों के लिए यह दैनिक दिनचर्या बताई गई है...",
  shortDescription: "आध्यात्मिक विकास के लिए एक अनुशासित दिनचर्या अत्यंत महत्वपूर्ण है। श्री सद्गुरु नारायण स्वामी के अनुयायियों के लिए...",
  images: {
    leftColumn: {
      image1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop',
      image2: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop'
    },
    rightColumn: {
      mainImage: 'https://images.unsplash.com/photo-1507697364665-69eec30ea71e?q=80&w=2071&auto=format&fit=crop',
      topImage: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?q=80&w=2072&auto=format&fit=crop',
      bottomImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop'
    }
  },
  routineSchedule: [
    {
      timePeriod: 'प्रातः काल (सुबह)',
      activities: [
        'सूर्योदय से पूर्व उठें (ब्रह्ममुहूर्त 4:00-5:30 बजे)',
        'नित्य कर्म से निवृत्त होकर स्नान करें',
        'सूर्य नमस्कार करें',
        '30 मिनट ध्यान का अभ्यास करें',
        'सद्गुरु नारायण स्वामी के भजन गाएं'
      ]
    },
    {
      timePeriod: 'मध्याह्न (दोपहर)',
      activities: [
        'सात्विक और पौष्टिक भोजन ग्रहण करें',
        'भोजन से पूर्व और पश्चात प्रार्थना करें',
        '15 मिनट विश्राम करें',
        'शास्त्रों या आध्यात्मिक पुस्तकों का अध्ययन करें'
      ]
    },
    {
      timePeriod: 'संध्या काल (शाम)',
      activities: [
        'संध्या आरती में भाग लें',
        'परिवार के साथ सत्संग करें',
        'दिन भर के कर्मों पर चिंतन करें'
      ]
    },
    {
      timePeriod: 'रात्रि (रात)',
      activities: [
        'हल्का भोजन करें',
        'सोने से पूर्व 15 मिनट मंत्र जाप करें',
        'भगवान और सद्गुरु का स्मरण करते हुए सोएं'
      ]
    },
    {
      timePeriod: 'साप्ताहिक अभ्यास',
      activities: [
        'एक दिन उपवास रखें',
        'सेवा कार्यों में भाग लें',
        'सामूहिक सत्संग में उपस्थित रहें'
      ]
    }
  ]
};

// GET - Get danic din charya data
router.get('/', async (req, res) => {
  try {
    let danicDinCharya = await DanicDinCharya.findOne();
    
    if (!danicDinCharya) {
      danicDinCharya = mockDanicDinCharyaData;
    }
    
    res.json(danicDinCharya);
  } catch (error) {
    console.error('Error fetching danic din charya data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch danic din charya data',
      details: error.message 
    });
  }
});

// PUT - Update danic din charya data
router.put('/', requireEditor, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      shortDescription,
      images,
      routineSchedule
    } = req.body;

    let danicDinCharya = await DanicDinCharya.findOne();
    
    if (!danicDinCharya) {
      // Create new document if none exists
      danicDinCharya = new DanicDinCharya({
        title,
        description,
        shortDescription,
        images,
        routineSchedule
      });
    } else {
      // Update existing document
      danicDinCharya.title = title || danicDinCharya.title;
      danicDinCharya.description = description || danicDinCharya.description;
      danicDinCharya.shortDescription = shortDescription || danicDinCharya.shortDescription;
      
      if (images) {
        if (images.leftColumn) {
          danicDinCharya.images.leftColumn = {
            ...danicDinCharya.images.leftColumn,
            ...images.leftColumn
          };
        }
        if (images.rightColumn) {
          danicDinCharya.images.rightColumn = {
            ...danicDinCharya.images.rightColumn,
            ...images.rightColumn
          };
        }
      }

      if (routineSchedule) {
        danicDinCharya.routineSchedule = routineSchedule;
      }
    }
    
    await danicDinCharya.save();
    res.json(danicDinCharya);
  } catch (error) {
    console.error('Error updating danic din charya data:', error);
    res.status(500).json({ 
      error: 'Failed to update danic din charya data',
      details: error.message 
    });
  }
});

// DELETE - Delete danic din charya data (reset to defaults)
router.delete('/', requireEditor, async (req, res) => {
  try {
    await DanicDinCharya.deleteMany({});
    res.json({ message: 'Danic din charya data reset to defaults' });
  } catch (error) {
    console.error('Error resetting danic din charya data:', error);
    res.status(500).json({ 
      error: 'Failed to reset danic din charya data',
      details: error.message 
    });
  }
});

module.exports = router; 