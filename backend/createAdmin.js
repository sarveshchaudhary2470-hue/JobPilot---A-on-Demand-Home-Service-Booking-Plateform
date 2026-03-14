// Run this script to create an admin user:
// node createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');

    const existing = await User.findOne({ email: 'admin@jobpilot.com' });
    if (existing) {
        console.log('Admin already exists. Email: admin@jobpilot.com');
        process.exit(0);
    }

    await User.create({
        name: 'JobPilot Admin',
        email: 'admin@jobpilot.com',
        password: 'admin123',
        phone: '9999999999',
        role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('   Email:    admin@jobpilot.com');
    console.log('   Password: admin123');
    process.exit(0);
};

createAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
