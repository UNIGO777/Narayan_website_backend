const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Content = require('../models/Content');
const Navigation = require('../models/Navigation');
const Contact = require('../models/Contact');
const Social = require('../models/Social');
const Event = require('../models/Event');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/narayan-gurukul', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Drop old indexes if they exist
    console.log('🔧 Dropping old indexes...');
    try {
      await User.collection.dropIndex('phoneNumber_1');
      console.log('✅ Dropped old phoneNumber index');
    } catch (error) {
      // Index doesn't exist, that's fine
      console.log('ℹ️  phoneNumber index doesn\'t exist (this is expected)');
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Content.deleteMany({});
    await Navigation.deleteMany({});
    await Contact.deleteMany({});
    await Social.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@narayangurukul.org',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      isActive: true
    });
    await adminUser.save();

    // Create editor user
   

    console.log('✅ Users created successfully');

    // Create sample content
    console.log('📝 Creating sample content...');
    const contentData = [
      {
        title: 'Home Hero Section',
        content: `
          <h1>श्री सद्गुरु नारायण स्वामी दरबार</h1>
          <h2>श्री सिद्ध नारायण टेकड़ी</h2>
          <p>Welcome to our sacred space dedicated to spiritual growth and enlightenment. Join us in our journey towards inner peace and divine connection.</p>
        `,
        section: 'hero-home',
        excerpt: 'Welcome to our sacred space dedicated to spiritual growth and enlightenment.',
        isPublished: true,
        author: adminUser._id,
        order: 1
      },
      {
        title: 'About Us',
        content: `
          <h2>Invest in Your Well-Being and Spiritual Growth</h2>
          <p>Shree Siddha Narayan Tekdi A BRIEF INTRODUCTION This hill became beautiful by the existence of Sanjeevan Samadhi of Shree Sadguru Narayan Swami. This hill became sacred by the Tapasya of Shree Dattaguru. The glorified Flag of Dharma always flies at this Narayan Tekdi. The glory of this sacred place is immense. All wishes come true if someone prays wholeheartedly to Shree Sadgurunath.</p>
        `,
        section: 'about-us',
        excerpt: 'Learn about our sacred heritage and spiritual significance.',
        isPublished: true,
        author: adminUser._id,
        order: 1
      },
      {
        title: 'Our Guruji',
        content: `
          <h2>Shree Sadguru Narayan Swami</h2>
          <p>Our revered Guruji, whose divine presence and teachings continue to guide devotees on the path of spiritual enlightenment. His sacred samadhi on this hill makes it a place of immense spiritual power and significance.</p>
        `,
        section: 'our-guruji',
        excerpt: 'Learn about our revered Guruji and his teachings.',
        isPublished: true,
        author: adminUser._id,
        order: 1
      },
      {
        title: 'Footer Information',
        content: `
          <h3>नारायण गुरुकुल</h3>
          <p>A sacred space dedicated to spiritual growth, education, and community service. Our temple serves as a beacon of light, guiding seekers on their spiritual journey.</p>
        `,
        section: 'footer-text',
        excerpt: 'Footer content for the website.',
        isPublished: true,
        author: adminUser._id,
        order: 1
      }
    ];

    for (const content of contentData) {
      await new Content(content).save();
    }

    console.log('✅ Content created successfully');

    // Create navigation menu
    console.log('🧭 Creating navigation menu...');
    const mainNavigation = new Navigation({
      name: 'Main Navigation',
      type: 'main',
      items: [
        {
          title: 'Home',
          url: '/',
          order: 1,
          isActive: true
        },
        {
          title: 'About',
          url: '/about',
          order: 2,
          isActive: true,
          children: [
            {
              title: 'About Us',
              url: '/about#about',
              order: 1,
              isActive: true
            },
            {
              title: 'History',
              url: '/about#history',
              order: 2,
              isActive: true
            },
            {
              title: 'Our Guruji',
              url: '/about#guruji',
              order: 3,
              isActive: true
            }
          ]
        },
        {
          title: 'Donations',
          url: '/donations',
          order: 3,
          isActive: true,
          children: [
            {
              title: 'Rakta Daan',
              url: '/donations#rakt-daan',
              order: 1,
              isActive: true
            },
            {
              title: 'Shram Daan',
              url: '/donations#shram-daan',
              order: 2,
              isActive: true
            },
            {
              title: 'Anya Daan',
              url: '/donations#anya-daan',
              order: 3,
              isActive: true
            }
          ]
        },
        {
          title: 'Events',
          url: '/events',
          order: 4,
          isActive: true
        },
        {
          title: 'Contact',
          url: '/contact',
          order: 5,
          isActive: true
        }
      ],
      isActive: true,
      createdBy: adminUser._id
    });
    await mainNavigation.save();

    console.log('✅ Navigation created successfully');

    // Create contact information
    console.log('📞 Creating contact information...');
    const contactInfo = new Contact({
      name: 'Main Temple Contact',
      type: 'main',
      addresses: [
        {
          label: 'Main Temple',
          street: 'Narayan Tekdi Hill',
          city: 'Spiritual City',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          isMain: true,
          isActive: true
        }
      ],
      phones: [
        {
          label: 'Main Office',
          number: '+91 98765 43210',
          type: 'mobile',
          isMain: true,
          isActive: true
        },
        {
          label: 'Temple Office',
          number: '+91 12345 67890',
          type: 'landline',
          isMain: false,
          isActive: true
        }
      ],
      emails: [
        {
          label: 'General Inquiries',
          address: 'info@narayangurukul.org',
          type: 'general',
          isMain: true,
          isActive: true
        },
        {
          label: 'Donations',
          address: 'donations@narayangurukul.org',
          type: 'donations',
          isMain: false,
          isActive: true
        }
      ],
      hours: [
        {
          day: 'monday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'tuesday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'wednesday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'thursday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'friday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'saturday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        },
        {
          day: 'sunday',
          openTime: '06:00',
          closeTime: '19:00',
          isClosed: false
        }
      ],
      isActive: true,
      createdBy: adminUser._id
    });
    await contactInfo.save();

    console.log('✅ Contact information created successfully');

    // Create social media links
    console.log('📱 Creating social media links...');
    const socialLinks = [
      {
        name: 'Facebook',
        platform: 'facebook',
        url: 'https://facebook.com/narayangurukul',
        username: 'narayangurukul',
        displayName: 'Narayan Gurukul',
        color: '#1877f2',
        isActive: true,
        showInHeader: true,
        showInFooter: true,
        order: 1,
        createdBy: adminUser._id
      },
      {
        name: 'Instagram',
        platform: 'instagram',
        url: 'https://instagram.com/narayangurukul',
        username: 'narayangurukul',
        displayName: 'Narayan Gurukul',
        color: '#e4405f',
        isActive: true,
        showInHeader: true,
        showInFooter: true,
        order: 2,
        createdBy: adminUser._id
      },
      {
        name: 'YouTube',
        platform: 'youtube',
        url: 'https://youtube.com/narayangurukul',
        username: 'narayangurukul',
        displayName: 'Narayan Gurukul',
        color: '#ff0000',
        isActive: true,
        showInHeader: true,
        showInFooter: true,
        order: 3,
        createdBy: adminUser._id
      }
    ];

    for (const social of socialLinks) {
      await new Social(social).save();
    }

    console.log('✅ Social media links created successfully');

    // Create sample events
    console.log('🎉 Creating sample events...');
    const eventsData = [
      {
        title: 'Guru Purnima Celebration',
        description: 'Join us for the auspicious celebration of Guru Purnima, honoring our revered Guruji and seeking his divine blessings.',
        shortDescription: 'Annual Guru Purnima celebration with special prayers and ceremonies.',
        category: 'festival',
        startDate: new Date('2024-07-21T06:00:00'),
        endDate: new Date('2024-07-21T19:00:00'),
        startTime: '06:00',
        endTime: '19:00',
        location: {
          name: 'Main Temple',
          address: 'Narayan Tekdi Hill, Spiritual City, Maharashtra',
          directions: 'Follow the main road to the hill and take the temple path.'
        },
        organizer: {
          name: 'Temple Committee',
          email: 'events@narayangurukul.org',
          phone: '+91 98765 43210'
        },
        registration: {
          isRequired: false,
          maxAttendees: null,
          currentAttendees: 0,
          price: 0,
          currency: 'INR'
        },
        status: 'published',
        isFeatured: true,
        tags: ['festival', 'guru-purnima', 'celebration'],
        createdBy: adminUser._id
      },
      {
        title: 'Weekly Meditation Session',
        description: 'Join our weekly meditation session for inner peace and spiritual growth. All levels welcome.',
        shortDescription: 'Weekly meditation session for spiritual growth.',
        category: 'meditation',
        startDate: new Date('2024-02-10T07:00:00'),
        endDate: new Date('2024-02-10T08:00:00'),
        startTime: '07:00',
        endTime: '08:00',
        location: {
          name: 'Meditation Hall',
          address: 'Narayan Tekdi Hill, Spiritual City, Maharashtra',
          directions: 'Enter through the main gate and follow signs to the meditation hall.'
        },
        organizer: {
          name: 'Meditation Group',
          email: 'meditation@narayangurukul.org',
          phone: '+91 98765 43210'
        },
        registration: {
          isRequired: true,
          maxAttendees: 50,
          currentAttendees: 12,
          price: 0,
          currency: 'INR'
        },
        status: 'published',
        isFeatured: false,
        isRecurring: true,
        recurringPattern: {
          type: 'weekly',
          interval: 1,
          daysOfWeek: ['saturday']
        },
        tags: ['meditation', 'weekly', 'spiritual'],
        createdBy: adminUser._id
      }
    ];

    for (const event of eventsData) {
      await new Event(event).save();
    }

    console.log('✅ Sample events created successfully');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`👤 Admin User: ${adminUser.email} (Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'})`);
    console.log(`📝 Editor User: ${editorUser.email} (Password: Editor@123)`);
    console.log(`📄 Content items: ${contentData.length}`);
    console.log(`🧭 Navigation menus: 1`);
    console.log(`📞 Contact info: 1`);
    console.log(`📱 Social links: ${socialLinks.length}`);
    console.log(`🎉 Events: ${eventsData.length}`);
    console.log('');
    console.log('🚀 You can now start the server and login to the admin panel!');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Check if script is run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, connectDB }; 