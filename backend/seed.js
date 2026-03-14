import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Service from './models/Service.js';

dotenv.config();

const categoriesData = [
    { name: "Women's Salon", icon: "✂️", color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Men's Salon", icon: "💈", color: "text-blue-500", bg: "bg-blue-50" },
    { name: "AC & Appliance", icon: "❄️", color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Cleaning", icon: "✨", color: "text-green-500", bg: "bg-green-50" },
    { name: "Electrician", icon: "⚡", color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Plumber", icon: "💧", color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Carpenter", icon: "🔨", color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Pest Control", icon: "🛡️", color: "text-red-500", bg: "bg-red-50" },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB Connected for Seeding...');

        // Clear existing data by dropping collections (avoids index issues)
        try {
            await Category.collection.drop();
        } catch (err) { /* ignore if doesn't exist */ }

        try {
            await Service.collection.drop();
        } catch (err) { /* ignore if doesn't exist */ }

        // Insert Categories
        const insertedCategories = await Category.insertMany(categoriesData);
        console.log('Categories seeded!');

        // Insert Demo Services based on categories mapping
        const getCatId = (name) => insertedCategories.find(c => c.name === name)._id;

        const servicesData = [
            {
                title: 'Party Makeup & Styling',
                category: getCatId("Women's Salon"),
                price: 1499,
                description: 'Complete party makeup including hair styling and saree draping.',
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600',
                includes: ['Premium HD Makeup', 'Hair styling / Blow dry', 'Saree / Lehenga draping', 'Nail paint application'],
                excludes: ['Pre-makeup facial', 'Washing of hair'],
                duration: '90 mins',
                rating: 4.8,
                reviews: 245,
                benefits: ['Top-rated professionals', 'Branded products only (MAC, Huda Beauty)', 'Hassle-free at-home service']
            },
            {
                title: 'Men Haircut & Beard Grooming',
                category: getCatId("Men's Salon"),
                price: 349,
                description: 'Professional haircut and beard styling at home.',
                image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600',
                includes: ['Any style haircut', 'Beard trimming & styling', 'Head & shoulder massage (10 mins)'],
                excludes: ['Hair coloring', 'Facial treatments'],
                duration: '45 mins',
                rating: 4.7,
                reviews: 512,
                benefits: ['Experienced barbers', 'Sterilized tools', 'No mess cleanup after service']
            },
            {
                title: 'AC Service & Repair',
                category: getCatId("AC & Appliance"),
                price: 499,
                description: 'Get your AC working like new with our expert technicians.',
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600',
                includes: ['Filter cleaning', 'Cooling coil wash', 'Gas pressure check', 'Drain pipe unblocking'],
                excludes: ['Gas refilling charges', 'Cost of spare parts'],
                duration: '60 mins',
                rating: 4.6,
                reviews: 890,
                benefits: ['30-day service warranty', 'Background-verified technicians', 'Transparent pricing']
            },
            {
                title: 'Deep House Cleaning',
                category: getCatId("Cleaning"),
                price: 2499,
                description: 'Intensive cleaning of every room, including floors and windows.',
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600',
                includes: ['Floor scrubbing', 'Window glass cleaning', 'Bathroom deep cleaning', 'Kitchen slab & sink cleaning'],
                excludes: ['Sofa shampooing', 'Inside-cabinet cleaning'],
                duration: '4-5 hours',
                rating: 4.9,
                reviews: 120,
                benefits: ['Eco-friendly cleaning agents', 'Professional grade equipment', 'Includes 2 professionals']
            },
            {
                title: 'Switchboard Repair & Installation',
                category: getCatId("Electrician"),
                price: 149,
                description: 'Fix faulty switches or install new switchboards.',
                image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600',
                includes: ['Diagnosis of fault', 'Repair of existing switch', 'Installation of new switch (provided by customer)'],
                excludes: ['Cost of new switches/wires', 'Concealed wiring work'],
                duration: '30 mins',
                rating: 4.5,
                reviews: 320,
                benefits: ['Licensed electricians', 'Safety checks included', 'Quick response']
            },
            {
                title: 'Basic Plumbing Repair',
                category: getCatId("Plumber"),
                price: 199,
                description: 'Fix leaks, blockages, and tap replacements.',
                image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=600',
                includes: ['Leak detection', 'Minor pipe repair', 'Tap or faucet replacement'],
                excludes: ['Cost of new taps/pipes', 'Major excavation'],
                duration: '45 mins',
                rating: 4.6,
                reviews: 415,
                benefits: ['Experienced plumbers', 'Water-saving advice', 'Clean workmanship']
            },
            {
                title: 'Furniture Assembly',
                category: getCatId("Carpenter"),
                price: 399,
                description: 'Expert assembly of IKEA, beds, wardrobes and more.',
                image: 'https://images.unsplash.com/photo-1581141849291-1125272215c3?q=80&w=600',
                includes: ['Unboxing and sorting parts', 'Complete assembly', 'Placement in desired location'],
                excludes: ['Moving heavy furniture between floors', 'Haul away of old furniture'],
                duration: '2 hours',
                rating: 4.8,
                reviews: 180,
                benefits: ['Own tools carried', 'Damage-free assembly', 'Flexible timings']
            },
            {
                title: 'General Pest Control',
                category: getCatId("Pest Control"),
                price: 899,
                description: 'Complete protection from cockroaches, ants, and spiders.',
                image: 'https://images.unsplash.com/photo-1585250917643-dc90e515d167?q=80&w=600',
                includes: ['Inspection of premises', 'Chemical spray treatment', 'Gel bait application in kitchen'],
                excludes: ['Termite treatment', 'Bed bug treatment'],
                duration: '90 mins',
                rating: 4.7,
                reviews: 295,
                benefits: ['Odorless chemicals', 'Safe for kids & pets', '3-month warranty with 1 free follow-up']
            }
        ];

        await Service.insertMany(servicesData);
        console.log('Services seeded!');

        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

seedData();
