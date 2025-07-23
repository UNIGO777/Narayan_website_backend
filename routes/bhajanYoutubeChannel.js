const express = require('express');
const router = express.Router();
const BhajanYoutubeChannel = require('../models/BhajanYoutubeChannel');
const { requireAuth, requireEditor } = require('../middleware/auth');

// Mock data for fallback
const mockBhajanYoutubeChannelData = {
  sectionInfo: {
    title: "Our Bhajan YouTube Channel",
    subtitle: "Subscribe for Divine Musical Journey",
    description: "Join our YouTube channel to experience live bhajan sessions, traditional performances, and spiritual discussions. Get notified about new uploads and special events."
  },
  channel: {
    name: "Narayan Gurukul Bhajans",
    description: "Official YouTube channel for sacred bhajans and spiritual music from Narayan Gurukul. Experience divine melodies and traditional devotional songs.",
    channelUrl: "https://youtube.com/@narayangurukulbhajans",
    channelId: "UCExample123",
    channelImage: "/src/assets/logo.png",
    bannerImage: "/src/assets/MandirInnerImage.jpeg",
    subscribers: 45600,
    totalViews: 2840000,
    totalVideos: 127,
    isActive: true,
    verificationStatus: "Verified",
    createdDate: "2023-01-01"
  },
  featuredVideos: [
    {
      title: "Om Namah Shivaya - Live Bhajan Session",
      description: "Experience the divine energy of Om Namah Shivaya mantra in this live bhajan session recorded at our temple.",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "25:30",
      publishedDate: "2024-01-15",
      views: 125000,
      likes: 8900,
      comments: 567,
      category: "Live Sessions",
      tags: ["Shiva", "Mantra", "Live", "Temple"],
      featured: true,
      isActive: true,
      quality: "1080p",
      language: "Sanskrit"
    },
    {
      title: "Hanuman Chalisa - Traditional Melody",
      description: "The complete Hanuman Chalisa sung in traditional style with harmonium and tabla accompaniment.",
      youtubeId: "dQw4w9WgXcQ",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "15:45",
      publishedDate: "2024-01-20",
      views: 89000,
      likes: 6700,
      comments: 423,
      category: "Traditional",
      tags: ["Hanuman", "Chalisa", "Traditional", "Devotional"],
      featured: true,
      isActive: true,
      quality: "1080p",
      language: "Hindi"
    }
  ],
  playlists: [
    {
      name: "Morning Bhajans",
      description: "Start your day with divine melodies",
      playlistId: "PLExample123",
      playlistUrl: "https://youtube.com/playlist?list=PLExample123",
      videoCount: 25,
      isActive: true
    }
  ]
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

// @route   GET /api/bhajan-youtube-channel
// @desc    Get bhajan YouTube channel data
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📺 Fetching Bhajan YouTube Channel data...');
    
    let channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      console.log('📝 No channel data found, using mock data');
      channelData = mockBhajanYoutubeChannelData;
    }
    
    console.log('✅ Bhajan YouTube channel data fetched successfully');
    res.json({
      success: true,
      message: 'Bhajan YouTube channel data fetched successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error fetching channel data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching channel data',
      data: mockBhajanYoutubeChannelData,
      error: error.message
    });
  }
});

// @route   PUT /api/bhajan-youtube-channel
// @desc    Update bhajan YouTube channel data
// @access  Private (Editor+)
router.put('/', requireEditor, async (req, res) => {
  try {
    console.log('📺 Updating Bhajan YouTube Channel data...');
    const updateData = req.body;

    let channelData = await BhajanYoutubeChannel.findOne();

    if (!channelData) {
      // Create new document if none exists
      channelData = new BhajanYoutubeChannel(updateData);
    } else {
      // Update existing document
      Object.assign(channelData, updateData);
    }

    await channelData.save();
    
    console.log('✅ Bhajan YouTube channel data updated successfully');
    res.json({
      success: true,
      message: 'Bhajan YouTube channel data updated successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error updating channel data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating channel data',
      error: error.message
    });
  }
});

// @route   POST /api/bhajan-youtube-channel/featured-video
// @desc    Add a featured video
// @access  Private (Editor+)
router.post('/featured-video', requireEditor, async (req, res) => {
  try {
    console.log('📺 Adding featured video...');
    const videoData = req.body;

    // Extract YouTube ID if URL is provided
    if (videoData.youtubeUrl && !videoData.youtubeId) {
      videoData.youtubeId = extractYouTubeId(videoData.youtubeUrl);
    }

    // Generate thumbnail URL if not provided
    if (videoData.youtubeId && !videoData.thumbnailUrl) {
      videoData.thumbnailUrl = generateThumbnailUrl(videoData.youtubeId);
    }

    // Parse tags if they're sent as string
    if (typeof videoData.tags === 'string') {
      videoData.tags = videoData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    let channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      channelData = new BhajanYoutubeChannel();
    }

    await channelData.addFeaturedVideo(videoData);

    console.log('✅ Featured video added successfully');
    res.json({
      success: true,
      message: 'Featured video added successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error adding featured video:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding featured video',
      error: error.message
    });
  }
});

// @route   PUT /api/bhajan-youtube-channel/featured-video/:index
// @desc    Update a featured video by index
// @access  Private (Editor+)
router.put('/featured-video/:index', requireEditor, async (req, res) => {
  try {
    console.log('📺 Updating featured video...');
    const index = parseInt(req.params.index);
    const updateData = req.body;

    // Extract YouTube ID if URL is provided
    if (updateData.youtubeUrl && !updateData.youtubeId) {
      updateData.youtubeId = extractYouTubeId(updateData.youtubeUrl);
    }

    // Generate thumbnail URL if not provided
    if (updateData.youtubeId && !updateData.thumbnailUrl) {
      updateData.thumbnailUrl = generateThumbnailUrl(updateData.youtubeId);
    }

    // Parse tags if they're sent as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: 'Channel data not found'
      });
    }

    await channelData.updateFeaturedVideoByIndex(index, updateData);

    console.log('✅ Featured video updated successfully');
    res.json({
      success: true,
      message: 'Featured video updated successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error updating featured video:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating featured video',
      error: error.message
    });
  }
});

// @route   DELETE /api/bhajan-youtube-channel/featured-video/:index
// @desc    Delete a featured video by index
// @access  Private (Editor+)
router.delete('/featured-video/:index', requireEditor, async (req, res) => {
  try {
    console.log('📺 Deleting featured video...');
    const index = parseInt(req.params.index);

    const channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: 'Channel data not found'
      });
    }

    await channelData.deleteFeaturedVideoByIndex(index);

    console.log('✅ Featured video deleted successfully');
    res.json({
      success: true,
      message: 'Featured video deleted successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error deleting featured video:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting featured video',
      error: error.message
    });
  }
});

// @route   POST /api/bhajan-youtube-channel/validate-url
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

// @route   GET /api/bhajan-youtube-channel/featured-videos
// @desc    Get active featured videos
// @access  Public
router.get('/featured-videos', async (req, res) => {
  try {
    console.log('📺 Fetching active featured videos...');
    
    const channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      return res.json({
        success: true,
        message: 'No featured videos found',
        data: []
      });
    }

    const featuredVideos = channelData.getActiveFeaturedVideos();

    console.log('✅ Featured videos fetched successfully');
    res.json({
      success: true,
      message: 'Featured videos fetched successfully',
      data: featuredVideos
    });
  } catch (error) {
    console.error('❌ Error fetching featured videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured videos',
      error: error.message
    });
  }
});

// @route   POST /api/bhajan-youtube-channel/video/:index/view
// @desc    Track video view by index
// @access  Public
router.post('/video/:index/view', async (req, res) => {
  try {
    console.log('📺 Tracking video view...');
    const index = parseInt(req.params.index);

    const channelData = await BhajanYoutubeChannel.findOne();
    
    if (channelData && channelData.featuredVideos[index]) {
      channelData.featuredVideos[index].views += 1;
      await channelData.save();
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

// @route   POST /api/bhajan-youtube-channel/playlist
// @desc    Add a playlist
// @access  Private (Editor+)
router.post('/playlist', requireEditor, async (req, res) => {
  try {
    console.log('📺 Adding playlist...');
    const playlistData = req.body;

    let channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      channelData = new BhajanYoutubeChannel();
    }

    channelData.playlists.push(playlistData);
    await channelData.save();

    console.log('✅ Playlist added successfully');
    res.json({
      success: true,
      message: 'Playlist added successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error adding playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding playlist',
      error: error.message
    });
  }
});

// @route   DELETE /api/bhajan-youtube-channel/playlist/:index
// @desc    Delete a playlist by index
// @access  Private (Editor+)
router.delete('/playlist/:index', requireEditor, async (req, res) => {
  try {
    console.log('📺 Deleting playlist...');
    const index = parseInt(req.params.index);

    const channelData = await BhajanYoutubeChannel.findOne();
    
    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: 'Channel data not found'
      });
    }

    if (channelData.playlists[index]) {
      channelData.playlists.splice(index, 1);
      await channelData.save();
    }

    console.log('✅ Playlist deleted successfully');
    res.json({
      success: true,
      message: 'Playlist deleted successfully',
      data: channelData
    });
  } catch (error) {
    console.error('❌ Error deleting playlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting playlist',
      error: error.message
    });
  }
});

module.exports = router; 