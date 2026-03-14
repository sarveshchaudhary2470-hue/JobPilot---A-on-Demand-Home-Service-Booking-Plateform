import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createPartners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connected');

        const partners = [
            {
                name: 'Ramesh Carpenter',
                email: 'ramesh@partner.jobpilot.com',
                phone: '9876543210',
                password: 'password123',
                role: 'partner'
            },
            {
                name: 'Suresh Electrician',
                email: 'suresh@partner.jobpilot.com',
                phone: '9876543211',
                password: 'password123',
                role: 'partner'
            },
            {
                name: 'Kamal Plumber',
                email: 'kamal@partner.jobpilot.com',
                phone: '9876543212',
                password: 'password123',
                role: 'partner'
            }
        ];

        for (const p of partners) {
            const exists = await User.findOne({ email: p.email });
            if (!exists) {
                const partner = new User(p);
                // password hashing is handled by pre-save hook in User model
                await partner.save();
                console.log(`Partner ${p.name} created successfully!`);
            } else {
                console.log(`Partner ${p.name} already exists.`);
            }
        }

        mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error creating partners:', error);
        mongoose.connection.close();
    }
};

createPartners();
