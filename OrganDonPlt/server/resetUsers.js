import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const resetUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Create default users with hashed passwords
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
    
    console.log('✅ Default users created successfully with hashed passwords!');
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@organlink.com / admin123');
    console.log('Doctor: doctor@hospital.com / doctor123');
    console.log('Donor: donor@example.com / donor123');
    console.log('Recipient: recipient@example.com / recipient123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting users:', error);
    process.exit(1);
  }
};

resetUsers();