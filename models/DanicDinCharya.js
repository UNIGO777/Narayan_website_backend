const mongoose = require('mongoose');

const DanicDinCharyaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'दैनिक दिनचर्या'
  },
  description: {
    type: String,
    required: true,
    default: `आध्यात्मिक विकास के लिए एक अनुशासित दिनचर्या अत्यंत महत्वपूर्ण है।
श्री सद्गुरु नारायण स्वामी के अनुयायियों के लिए यह दैनिक दिनचर्या बताई गई है।

प्रातः काल (सुबह):
- सूर्योदय से पूर्व उठें (ब्रह्ममुहूर्त 4:00-5:30 बजे)
- नित्य कर्म से निवृत्त होकर स्नान करें
- सूर्य नमस्कार करें
- 30 मिनट ध्यान का अभ्यास करें
- सद्गुरु नारायण स्वामी के भजन गाएं

मध्याह्न (दोपहर):
- सात्विक और पौष्टिक भोजन ग्रहण करें
- भोजन से पूर्व और पश्चात प्रार्थना करें
- 15 मिनट विश्राम करें
- शास्त्रों या आध्यात्मिक पुस्तकों का अध्ययन करें

संध्या काल (शाम):
- संध्या आरती में भाग लें
- परिवार के साथ सत्संग करें
- दिन भर के कर्मों पर चिंतन करें

रात्रि (रात):
- हल्का भोजन करें
- सोने से पूर्व 15 मिनट मंत्र जाप करें
- भगवान और सद्गुरु का स्मरण करते हुए सोएं

साप्ताहिक अभ्यास:
- एक दिन उपवास रखें
- सेवा कार्यों में भाग लें
- सामूहिक सत्संग में उपस्थित रहें

यह दिनचर्या शारीरिक, मानसिक और आध्यात्मिक स्वास्थ्य को संतुलित रखने में सहायता करेगी। अनुशासन और नियमितता इस मार्ग के मूल आधार हैं।`
  },
  shortDescription: {
    type: String,
    required: true,
    default: `आध्यात्मिक विकास के लिए एक अनुशासित दिनचर्या अत्यंत महत्वपूर्ण है।
श्री सद्गुरु नारायण स्वामी के अनुयायियों के लिए यह दैनिक दिनचर्या बताई गई है...`
  },
  images: {
    leftColumn: {
      image1: {
        type: String,
        default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop'
      },
      image2: {
        type: String,
        default: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop'
      }
    },
    rightColumn: {
      mainImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1507697364665-69eec30ea71e?q=80&w=2071&auto=format&fit=crop'
      },
      topImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?q=80&w=2072&auto=format&fit=crop'
      },
      bottomImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop'
      }
    }
  },
  routineSchedule: [
    {
      timePeriod: {
        type: String,
        default: 'प्रातः काल (सुबह)'
      },
      activities: {
        type: [String],
        default: [
          'सूर्योदय से पूर्व उठें (ब्रह्ममुहूर्त 4:00-5:30 बजे)',
          'नित्य कर्म से निवृत्त होकर स्नान करें',
          'सूर्य नमस्कार करें',
          '30 मिनट ध्यान का अभ्यास करें',
          'सद्गुरु नारायण स्वामी के भजन गाएं'
        ]
      }
    },
    {
      timePeriod: {
        type: String,
        default: 'मध्याह्न (दोपहर)'
      },
      activities: {
        type: [String],
        default: [
          'सात्विक और पौष्टिक भोजन ग्रहण करें',
          'भोजन से पूर्व और पश्चात प्रार्थना करें',
          '15 मिनट विश्राम करें',
          'शास्त्रों या आध्यात्मिक पुस्तकों का अध्ययन करें'
        ]
      }
    },
    {
      timePeriod: {
        type: String,
        default: 'संध्या काल (शाम)'
      },
      activities: {
        type: [String],
        default: [
          'संध्या आरती में भाग लें',
          'परिवार के साथ सत्संग करें',
          'दिन भर के कर्मों पर चिंतन करें'
        ]
      }
    },
    {
      timePeriod: {
        type: String,
        default: 'रात्रि (रात)'
      },
      activities: {
        type: [String],
        default: [
          'हल्का भोजन करें',
          'सोने से पूर्व 15 मिनट मंत्र जाप करें',
          'भगवान और सद्गुरु का स्मरण करते हुए सोएं'
        ]
      }
    },
    {
      timePeriod: {
        type: String,
        default: 'साप्ताहिक अभ्यास'
      },
      activities: {
        type: [String],
        default: [
          'एक दिन उपवास रखें',
          'सेवा कार्यों में भाग लें',
          'सामूहिक सत्संग में उपस्थित रहें'
        ]
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('DanicDinCharya', DanicDinCharyaSchema); 