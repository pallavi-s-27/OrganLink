import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
  try {
    await connectDB();
    
    const users = await User.find({}, 'name email role').lean();
    
    console.log('📋 Existing users in database:');
    console.log('================================');
    users.forEach(user => {
      console.log(`• ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🔑 You can try logging in with these emails:');
    users.forEach(user => {
      console.log(`• ${user.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing users:', error);
    process.exit(1);
  }
};

listUsers();