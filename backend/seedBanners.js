import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './models/Banner.js';

dotenv.config();

const bannersData = [
    {
        image: 'http://localhost:5000/uploads/banners/banner_electrician.png',
        title: 'Expert Electricians at Your Doorstep',
        link: '/services?category=Electrician',
        isActive: true
    },
    {
        image: 'http://localhost:5000/uploads/banners/banner_cleaning.png',
        title: 'Sparkling Clean Homes, Every Time',
        link: '/services?category=Cleaning',
        isActive: true
    },
    {
        image: 'http://localhost:5000/uploads/banners/banner_plumber.png',
        title: 'Professional Plumbing Solutions',
        link: '/services?category=Plumber',
        isActive: true
    },
    {
        image: 'http://localhost:5000/uploads/banners/banner_painting.png',
        title: 'Transform Your Home with Fresh Colors',
        link: '/services?category=Painting',
        isActive: true
    },
    {
        image: 'http://localhost:5000/uploads/banners/banner_smarthome.png',
        title: 'Make Your Home Smarter Today',
        link: '/services?category=Smart%20Home',
        isActive: true
    }
];

const seedBanners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connected');

        await Banner.deleteMany({});
        console.log('Old banners cleared');

        await Banner.insertMany(bannersData);
        console.log(`✅ ${bannersData.length} new professional banners seeded successfully!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding banners:', error);
        process.exit(1);
    }
};

seedBanners();
