import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    includes: [{
        type: String
    }],
    excludes: [{
        type: String
    }],
    duration: {
        type: String,
        default: "60 mins"
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    priceInfos: [{
        duration: String, // e.g., '1 hour', '2 hours'
        price: Number,
    }],
    allowedPincodes: [{
        type: String,
        trim: true
    }],
    benefits: [{
        type: String
    }]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
