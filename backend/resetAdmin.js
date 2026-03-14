// Resets the admin user password
// Run: node resetAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');

    // Delete existing admin (if any) and recreate fresh
    await User.deleteOne({ email: 'admin@jobpilot.com' });

    await User.create({
        name: 'JobPilot Admin',
        email: 'admin@jobpilot.com',
        password: 'admin123',
        phone: '9999999999',
        role: 'admin'
    });

    console.log('✅ Admin reset successfully!');
    console.log('   Email:    admin@jobpilot.com');
    console.log('   Password: admin123');
    process.exit(0);
};

resetAdmin().catch(err => { console.error(err); process.exit(1); });
