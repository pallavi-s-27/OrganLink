import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist in database');
      process.exit(0);
    }

    // Create default users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@organlink.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1-555-0100',
        organization: 'OrganLink HQ',
        city: 'San Francisco',
        country: 'USA'
      },
      {
        name: 'Dr. Sarah Mitchell',
        email: 'doctor@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+1-555-0101',
        organization: 'General Hospital',
        city: 'Boston',
        country: 'USA'
      },
      {
        name: 'John Donor',
        email: 'donor@example.com',
        password: 'donor123',
        role: 'donor',
        phone: '+1-555-0102',
        organization: 'Community Center',
        city: 'Seattle',
        country: 'USA',
        bloodGroup: 'O+',
        organType: 'Kidney'
      },
      {
        name: 'Jane Recipient',
        email: 'recipient@example.com',
        password: 'recipient123',
        role: 'recipient',
        phone: '+1-555-0103',
        organization: 'City Hospital',
        city: 'Portland',
        country: 'USA',
        bloodGroup: 'O+',
        organType: 'Kidney',
        urgency: 8
      }
    ];

    // Create users one by one to trigger password hashing middleware
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }
    console.log('✅ Default users created successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@organlink.com / admin123');
    console.log('Doctor: doctor@hospital.com / doctor123');
    console.log('Donor: donor@example.com / donor123');
    console.log('Recipient: recipient@example.com / recipient123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();