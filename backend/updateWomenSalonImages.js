import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';
import Category from './models/Category.js';

dotenv.config();

const BASE_URL = 'http://localhost:5000/uploads/services';

const imageMapping = {
    "Haircut & Styling": `${BASE_URL}/ws_haircut.png`,
    "Full Body Waxing": `${BASE_URL}/ws_waxing.png`,
    "Basic Facial": `${BASE_URL}/ws_basic_facial.png`,
    "Premium Glow Facial": `${BASE_URL}/ws_glow_facial.png`,
    "Manicure & Pedicure": `${BASE_URL}/ws_manicure.png`,
    "Threading & Face Waxing": `${BASE_URL}/ws_threading.png`,
    "Hair Coloring": `${BASE_URL}/ws_hair_coloring.png`,
    "Hair Spa Treatment": `${BASE_URL}/ws_hair_spa.png`,
    "Bridal Makeup": `${BASE_URL}/ws_bridal_makeup.png`,
    "Party Makeup": `${BASE_URL}/ws_party_makeup.png`,
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connected');

        // Find Women's Salon category
        const womenSalon = await Category.findOne({ name: "Women's Salon" });
        if (!womenSalon) {
            console.error("Women's Salon category not found!");
            process.exit(1);
        }

        // Update each service's image
        for (const [serviceName, imageUrl] of Object.entries(imageMapping)) {
            const result = await Service.findOneAndUpdate(
                { title: serviceName, category: womenSalon._id },
                { image: imageUrl },
                { new: true }
            );
            if (result) {
                console.log(`✅ Updated: ${serviceName}`);
            } else {
                console.log(`⚠️ Not found: ${serviceName}`);
            }
        }

        console.log('\n🎉 All Women\'s Salon service images updated!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImages();
