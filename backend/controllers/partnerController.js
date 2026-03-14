import Booking from '../models/Booking.js';
import SupportTicket from '../models/SupportTicket.js';
import EmergencyAlert from '../models/EmergencyAlert.js';

// @desc    Get all jobs assigned to the logged-in partner
// @route   GET /api/partner/jobs
// @access  Private/Partner
export const getPartnerJobs = async (req, res) => {
    try {
        const jobs = await Booking.find({ assignedTo: req.user._id })
            .populate('user', 'name email phone')
            .populate('service', 'title image price duration')
            .sort({ date: 1, timeSlot: 1 }); // Sort by upcoming
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assigned jobs', error: error.message });
    }
};

// @desc    Update status of an assigned job
// @route   PATCH /api/partner/jobs/:id/status
// @access  Private/Partner
export const updateJobStatus = async (req, res) => {
    try {
        const { status, otp, beforeImage, afterImage } = req.body;
        // Verify it's assigned to this partner
        const booking = await Booking.findOne({ _id: req.params.id, assignedTo: req.user._id });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or not assigned to you' });
        }

        const allowedStatuses = ['in-progress', 'completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update for partner' });
        }

        // OTP & Image Validation Logic
        if (status === 'in-progress') {
            if (!beforeImage) {
                return res.status(400).json({ message: 'A "Before Work" image is required to start the job.' });
            }
            if (!otp || otp !== booking.startOTP) {
                return res.status(400).json({ message: 'Invalid Start PIN. Please ask the customer.' });
            }
            booking.beforeImage = beforeImage;
        }

        if (status === 'completed') {
            if (!afterImage) {
                return res.status(400).json({ message: 'An "After Work" image is required to complete the job.' });
            }
            if (!otp || otp !== booking.endOTP) {
                return res.status(400).json({ message: 'Invalid Completion PIN. Please ask the customer.' });
            }
            booking.afterImage = afterImage;
        }

        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update job status', error: error.message });
    }
};

// @desc    Submit a new partner application
// @route   POST /api/partner/apply
// @access  Public
import bcrypt from 'bcryptjs';
import PartnerApplication from '../models/PartnerApplication.js';

export const submitApplication = async (req, res) => {
    try {
        const { name, email, phone, password, addressLine1, addressLine2, city, state, pincode, aadharNumber, panNumber, servicesOffered } = req.body;

        // Check if application already exists
        const existingApp = await PartnerApplication.findOne({ email });
        if (existingApp) {
            return res.status(400).json({ message: 'An application with this email already exists' });
        }

        // Hash the requested password to store it securely in the application
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const application = await PartnerApplication.create({
            name, email, phone, password: passwordHash, addressLine1, addressLine2, city, state, pincode, aadharNumber, panNumber, servicesOffered
        });

        res.status(201).json({ message: 'Application submitted successfully', applicationId: application._id });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
};

// ─── SUPPORT TICKETS ────────────────────────────────────────────────────────

// @desc    Create a new support ticket
// @route   POST /api/partner/support
// @access  Private/Partner
export const createSupportTicket = async (req, res) => {
    try {
        const { subject, description } = req.body;

        const ticket = await SupportTicket.create({
            partner: req.user._id,
            subject,
            messages: [{ sender: 'Partner', text: description }]
        });

        res.status(201).json({ message: 'Support ticket raised successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create support ticket', error: error.message });
    }
};

// @desc    Get all support tickets for the logged-in partner
// @route   GET /api/partner/support
// @access  Private/Partner
export const getMySupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ partner: req.user._id })
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch your support tickets', error: error.message });
    }
};

// @desc    Partner replies to a specific ticket
// @route   POST /api/partner/support/:id/reply
// @access  Private/Partner
export const replySupportTicket = async (req, res) => {
    try {
        const { text } = req.body;

        const ticket = await SupportTicket.findOne({ _id: req.params.id, partner: req.user._id });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
        if (ticket.status === 'Resolved') return res.status(400).json({ message: 'Ticket is already resolved.' });

        ticket.messages.push({ sender: 'Partner', text });
        await ticket.save();

        res.json({ message: 'Reply sent', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reply to ticket', error: error.message });
    }
};

// @desc    Partner deletes a specific resolved ticket
// @route   DELETE /api/partner/support/:id
// @access  Private/Partner
export const deleteSupportTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findOne({ _id: req.params.id, partner: req.user._id });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
        if (ticket.status !== 'Resolved') return res.status(400).json({ message: 'Only resolved tickets can be deleted.' });

        await ticket.deleteOne();
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete ticket', error: error.message });
    }
};

// ─── EMERGENCY SOS ──────────────────────────────────────────────────────────

// @desc    Trigger an emergency SOS alert
// @route   POST /api/partner/emergency
// @access  Private/Partner
export const triggerEmergency = async (req, res) => {
    try {
        // Find if partner is currently assigned to any active job to pluck customer details
        const activeBooking = await Booking.findOne({
            assignedTo: req.user._id,
            status: { $in: ['confirmed', 'in-progress'] }
        }).sort({ date: 1, timeSlot: 1 }).populate('user');

        const alert = await EmergencyAlert.create({
            partner: req.user._id,
            customerName: activeBooking ? activeBooking.customerName : 'Unknown (Not on active job)',
            customerPhone: activeBooking ? activeBooking.customerPhone : 'Unknown',
            customerAddress: activeBooking && activeBooking.address
                ? `${activeBooking.address.houseNo || ''} ${activeBooking.address.addressLine1}, ${activeBooking.address.city}`
                : 'Unknown Address',
        });

        res.status(201).json({ message: 'Emergency SOS Triggered successfully', alert });
    } catch (error) {
        res.status(500).json({ message: 'Failed to trigger SOS', error: error.message });
    }
};

// @desc    Get all emergency SOS logs for logged-in partner
// @route   GET /api/partner/emergency
// @access  Private/Partner
export const getMyEmergencies = async (req, res) => {
    try {
        const emergencies = await EmergencyAlert.find({ partner: req.user._id })
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch emergency logs', error: error.message });
    }
};
