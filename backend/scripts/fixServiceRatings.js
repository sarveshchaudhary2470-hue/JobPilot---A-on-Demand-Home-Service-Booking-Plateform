import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Service from '../models/Service.js';
import Review from '../models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot')
  .then(async () => {
    console.log('Connected to MongoDB');
    const services = await Service.find();
    console.log(`Found ${services.length} services to update...`);
    
    for (let service of services) {
        const reviews = await Review.find({ service: service._id });
        if (reviews.length === 0) {
            service.rating = 0;
            service.reviews = 0;
        } else {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            service.rating = sum / reviews.length;
            service.reviews = reviews.length;
        }
        await service.save();
    }
    console.log('Successfully fixed all service ratings!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
