const express = require('express');
const router = express.Router();
const YoutubeVideo = require('../models/YoutubeVideo');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockYoutubeVideoData = {
  sectionInfo: {
    title: "Featured Video",
    subtitle: "Spiritual Teachings & Temple Life",
    description: "Watch our latest spiritual discourse and get insights into temple traditions, daily practices, and the path of devotion."
  },
  video: {
    id: 1,
    title: "Temple Introduction & Spiritual Guidance",
    description: "A comprehensive overview of our temple, its spiritual significance, daily rituals, and the path of devotion. Join us on this spiritual journey and discover the peace and wisdom that comes from connecting with the divine.",
    youtubeId: "dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "15:30",
    publishedDate: "2024-01-15",
    views: 12500,
    likes: 850,
    category: "Spiritual Teachings",
    tags: ["Temple", "Spirituality", "Guidance", "Devotion", "Peace"],
    featured: true,
    isActive: true,
    order: 1
  }
};

// Helper function to extract YouTube ID from URL
const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to generate thumbnail URL
const generateThumbnailUrl = (youtubeId) => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
};

// @route   GET /api/youtube-video
// @desc    Get YouTube video data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📺 Fetching YouTube Video data...');
    
    let youtubeVideoData = await YoutubeVideo.findOne();
    
    if (!youtubeVideoData) {
      console.log('📝 No YouTube video data found, using mock data');
      youtubeVideoData = mockYoutubeVideoData;
    }
    
    console.log('✅ YouTube video data fetched successfully');
    res.json({
      success: true,
      message: 'YouTube video data fetched successfully',
      data: youtubeVideoData
    });
  } catch (error) {
    console.error('❌ Error fetching YouTube video data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching YouTube video data',
      data: mockYoutubeVideoData,
      error: error.message
    });
  }
});

// @route   PUT /api/youtube-video
// @desc    Update YouTube video data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('📺 Updating YouTube Video data...');
    const { sectionInfo, video } = req.body;

    let youtubeVideoData = await YoutubeVideo.findOne();

    if (!youtubeVideoData) {
      // Create new document if none exists
      youtubeVideoData = new YoutubeVideo({
        sectionInfo,
        video
      });
    } else {
      // Update existing document
      if (sectionInfo) {
        youtubeVideoData.sectionInfo = {
          ...youtubeVideoData.sectionInfo,
          ...sectionInfo
        };
      }
      if (video) {
        // Extract YouTube ID if URL is provided
        if (video.youtubeUrl && !video.youtubeId) {
          video.youtubeId = extractYouTubeId(video.youtubeUrl);
        }
        
        // Generate thumbnail URL if not provided
        if (video.youtubeId && !video.thumbnailUrl) {
          video.thumbnailUrl = generateThumbnailUrl(video.youtubeId);
        }
        
        youtubeVideoData.video = {
          ...youtubeVideoData.video,
          ...video
        };
      }
    }

    await youtubeVideoData.save();
    
    console.log('✅ YouTube video data updated successfully');
    res.json({
      success: true,
      message: 'YouTube video data updated successfully',
      data: youtubeVideoData
    });
  } catch (error) {
    console.error('❌ Error updating YouTube video data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating YouTube video data',
      error: error.message
    });
  }
});

// @route   DELETE /api/youtube-video
// @desc    Reset YouTube video data to defaults
// @access  Private (Editor+)
router.delete('/', requireEditor, async (req, res) => {
  try {
    console.log('📺 Resetting YouTube Video data to defaults...');
    
    await YoutubeVideo.deleteMany({});
    
    console.log('✅ YouTube video data reset successfully');
    res.json({
      success: true,
      message: 'YouTube video data reset to defaults successfully',
      data: mockYoutubeVideoData
    });
  } catch (error) {
    console.error('❌ Error resetting YouTube video data:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting YouTube video data',
      error: error.message
    });
  }
});

// @route   POST /api/youtube-video/validate-url
// @desc    Validate YouTube URL and extract video info
// @access  Private (Editor+)
router.post('/validate-url', requireEditor, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required'
      });
    }

    const youtubeId = extractYouTubeId(url);
    
    if (!youtubeId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const thumbnailUrl = generateThumbnailUrl(youtubeId);

    console.log('✅ YouTube URL validated successfully');
    res.json({
      success: true,
      message: 'YouTube URL validated successfully',
      data: {
        youtubeId,
        thumbnailUrl,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`
      }
    });
  } catch (error) {
    console.error('❌ Error validating YouTube URL:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating YouTube URL',
      error: error.message
    });
  }
});

// @route   POST /api/youtube-video/track-view
// @desc    Track video view
// @access  Public
router.post('/track-view', async (req, res) => {
  try {
    console.log('📺 Tracking video view...');
    
    const youtubeVideoData = await YoutubeVideo.findOne();
    
    if (youtubeVideoData && youtubeVideoData.video) {
      youtubeVideoData.video.views += 1;
      await youtubeVideoData.save();
      console.log('✅ Video view tracked successfully');
    }
    
    res.json({
      success: true,
      message: 'Video view tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking video view:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking video view',
      error: error.message
    });
  }
});

// @route   GET /api/youtube-video/info
// @desc    Get video info for admin
// @access  Private (Editor+)
router.get('/info', requireEditor, async (req, res) => {
  try {
    const youtubeVideoData = await YoutubeVideo.findOne();
    
    if (!youtubeVideoData) {
      return res.status(404).json({
        success: false,
        message: 'YouTube video data not found'
      });
    }

    // Return additional info for admin
    const info = {
      ...youtubeVideoData.toObject(),
      embedUrl: `https://www.youtube.com/embed/${youtubeVideoData.video.youtubeId}`,
      watchUrl: youtubeVideoData.video.youtubeUrl,
      thumbnailUrls: {
        default: `https://img.youtube.com/vi/${youtubeVideoData.video.youtubeId}/default.jpg`,
        medium: `https://img.youtube.com/vi/${youtubeVideoData.video.youtubeId}/mqdefault.jpg`,
        high: `https://img.youtube.com/vi/${youtubeVideoData.video.youtubeId}/hqdefault.jpg`,
        maxres: `https://img.youtube.com/vi/${youtubeVideoData.video.youtubeId}/maxresdefault.jpg`
      }
    };

    res.json({
      success: true,
      message: 'YouTube video info fetched successfully',
      data: info
    });
  } catch (error) {
    console.error('❌ Error fetching YouTube video info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching YouTube video info',
      error: error.message
    });
  }
});

module.exports = router; 