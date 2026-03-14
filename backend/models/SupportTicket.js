import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    messages: [
        {
            sender: {
                type: String,
                enum: ['Partner', 'Admin'],
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: String,
        enum: ['Open', 'Resolved'],
        default: 'Open'
    }
}, { timestamps: true });

export default mongoose.model('SupportTicket', supportTicketSchema);
