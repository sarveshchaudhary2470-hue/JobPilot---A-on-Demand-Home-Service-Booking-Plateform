import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    bg: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
