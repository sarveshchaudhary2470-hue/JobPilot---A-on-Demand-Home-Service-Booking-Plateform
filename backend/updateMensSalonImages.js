import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';
import Category from './models/Category.js';

dotenv.config();

const BASE_URL = 'http://localhost:5000/uploads/services';

const imageMapping = {
    "Men's Haircut": `${BASE_URL}/ms_haircut.png`,
    "Beard Trim & Styling": `${BASE_URL}/ms_beard_trim.png`,
    "Head Massage": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    "De-tan Facial": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    "Hair Color": "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop",
    "Kids Haircut": "https://images.unsplash.com/photo-1592647420148-bfcc177e2117?q=80&w=800&auto=format&fit=crop",
    "Body Massage": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
    "Pedicure for Men": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
    "Hair Spa": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    "Anti-dandruff Treatment": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop",
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connected');

        const mensSalon = await Category.findOne({ name: "Men's Salon" });
        if (!mensSalon) {
            console.error("Men's Salon category not found!");
            process.exit(1);
        }

        for (const [serviceName, imageUrl] of Object.entries(imageMapping)) {
            const result = await Service.findOneAndUpdate(
                { title: serviceName, category: mensSalon._id },
                { image: imageUrl },
                { new: true }
            );
            if (result) {
                console.log(`✅ Updated: ${serviceName}`);
            } else {
                console.log(`⚠️ Not found: ${serviceName}`);
            }
        }

        console.log('\n🎉 All Men\'s Salon service images updated!');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateImages();
