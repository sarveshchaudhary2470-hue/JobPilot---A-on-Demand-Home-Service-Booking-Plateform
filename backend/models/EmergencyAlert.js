import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Resolved'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('EmergencyAlert', emergencyAlertSchema);
