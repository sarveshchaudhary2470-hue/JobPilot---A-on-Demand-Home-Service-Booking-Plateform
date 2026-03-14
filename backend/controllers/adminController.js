import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import Banner from '../models/Banner.js';
import Review from '../models/Review.js';
import SupportTicket from '../models/SupportTicket.js';
import EmergencyAlert from '../models/EmergencyAlert.js';

// ─── STATS ───────────────────────────────────────────────────────────────────

export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalPartners, totalBookings, totalServices, bookings] = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'partner' }),
            Booking.countDocuments(),
            Service.countDocuments(),
            Booking.find().select('totalAmount status')
        ]);

        const totalRevenue = bookings
            .filter(b => b.status !== 'cancelled')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const pendingBookings = bookings.filter(b => b.status === 'pending').length;

        res.json({ totalUsers, totalPartners, totalBookings, totalServices, totalRevenue, pendingBookings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .populate('service', 'title price image')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email').populate('service', 'title');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const assignPartner = async (req, res) => {
    try {
        const { partnerId } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { assignedTo: partnerId, status: 'confirmed' }, // auto-confirm when assigned
            { new: true }
        ).populate('user', 'name email').populate('service', 'title').populate('assignedTo', 'name');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── PARTNERS ────────────────────────────────────────────────────────────────

export const getAllPartners = async (req, res) => {
    try {
        const partners = await User.find({ role: 'partner' }).select('-password').sort('-createdAt');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getPartnerDetails = async (req, res) => {
    try {
        const partner = await User.findById(req.params.id).select('-password');
        if (!partner || partner.role !== 'partner') {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Fetch application details by email
        const application = await PartnerApplication.findOne({ email: partner.email });

        res.json({
            ...partner.toObject(),
            application: application || null
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching partner details', error: err.message });
    }
};

// Create a new partner
export const createPartner = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const partner = await User.create({
            name, email, phone, password, role: 'partner'
        });

        res.status(201).json({
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            phone: partner.phone,
            createdAt: partner.createdAt,
            suspended: partner.suspended
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating partner', error: error.message });
    }
};

// Delete a partner
export const deletePartner = async (req, res) => {
    try {
        const partner = await User.findById(req.params.id);
        if (!partner || partner.role !== 'partner') {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Optional: Check if partner has active bookings
        const activeBookings = await Booking.findOne({ assignedTo: partner._id, status: { $in: ['pending', 'confirmed', 'in-progress'] } });
        if (activeBookings) {
            return res.status(400).json({ message: 'Cannot delete partner with active assignments' });
        }

        await partner.deleteOne();
        res.json({ message: 'Partner deleted completely' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error: error.message });
    }
};

// Toggle partner suspend status
export const togglePartnerSuspend = async (req, res) => {
    try {
        const partner = await User.findById(req.params.id);
        if (!partner || partner.role !== 'partner') {
            return res.status(404).json({ message: 'Partner not found' });
        }

        partner.suspended = !partner.suspended;
        await partner.save();

        res.json({ message: `Partner account ${partner.suspended ? 'suspended' : 'activated'} successfully`, suspended: partner.suspended });
    } catch (error) {
        res.status(500).json({ message: 'Error updating partner status', error: error.message });
    }
};

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── BANNERS ─────────────────────────────────────────────────────────────────

export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.json(banner);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email img')
            .populate('service', 'title category')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching reviews', error: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error deleting review', error: err.message });
    }
};

// --- Customers ---
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const toggleCustomerSuspend = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer || customer.role !== 'customer') {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.suspended = !customer.suspended;
        await customer.save();

        res.json({ message: `Customer account ${customer.suspended ? 'suspended' : 'activated'}`, customer });
    } catch (err) {
        res.status(500).json({ message: 'Server error updating customer status', error: err.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error deleting customer', error: err.message });
    }
};

// ─── PARTNER APPLICATIONS ────────────────────────────────────────────────────

import PartnerApplication from '../models/PartnerApplication.js';

export const getPartnerApplications = async (req, res) => {
    try {
        const applications = await PartnerApplication.find().sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const approvePartnerApplication = async (req, res) => {
    try {
        // Find application but explicitly select the password since it is `select: false` by default
        const application = await PartnerApplication.findById(req.params.id).select('+password');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        if (application.status !== 'pending') {
            return res.status(400).json({ message: `Application is already ${application.status}` });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: application.email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }

        // Create the new Partner User. 
        // We override the pre-save hook by directly creating it with the already hashed password,
        // so we need to bypass `save()` middleware or just let it hash again if we weren't careful.
        // Actually, since our User pre-save hook hashes `password` automatically, 
        // we can just use `User.collection.insertOne` to bypass it, OR we can store plain text in Application (unsecure),
        // OR we can safely insert ignoring the hook:
        await User.collection.insertOne({
            name: application.name,
            email: application.email,
            phone: application.phone,
            password: application.password, // This is already hashed
            role: 'partner',
            suspended: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Mark application as approved
        application.status = 'approved';
        await application.save();

        res.json({ message: 'Partner application approved and account created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const rejectPartnerApplication = async (req, res) => {
    try {
        const application = await PartnerApplication.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = 'rejected';
        await application.save();

        res.json({ message: 'Application rejected' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ─── PARTNER SUPPORT TICKETS ──────────────────────────────────────────────────

export const getSupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('partner', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching tickets', error: err.message });
    }
};

export const replyToSupportTicket = async (req, res) => {
    try {
        const { adminReply, status } = req.body;

        const ticket = await SupportTicket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Support ticket not found' });
        }

        if (adminReply) {
            ticket.messages.push({ sender: 'Admin', text: adminReply });
        }

        if (status) ticket.status = status;

        await ticket.save();

        res.json({ message: 'Reply sent successfully', ticket });
    } catch (err) {
        res.status(500).json({ message: 'Server error replying to ticket', error: err.message });
    }
};

export const deleteSupportTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

        res.json({ message: 'Ticket deleted successfully by admin' });
    } catch (err) {
        res.status(500).json({ message: 'Server error deleting ticket', error: err.message });
    }
};

// ─── PARTNER EMERGENCIES ──────────────────────────────────────────────────────

export const getEmergencies = async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const emergencies = await EmergencyAlert.find(filter)
            .populate('partner', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(emergencies);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching emergencies', error: err.message });
    }
};

export const resolveEmergency = async (req, res) => {
    try {
        const emergency = await EmergencyAlert.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency alert not found' });

        emergency.status = 'Resolved';
        await emergency.save();

        res.json({ message: 'Emergency marked as resolved', emergency });
    } catch (err) {
        res.status(500).json({ message: 'Server error resolving emergency', error: err.message });
    }
};

export const deleteEmergency = async (req, res) => {
    try {
        const emergency = await EmergencyAlert.findById(req.params.id);
        if (!emergency) return res.status(404).json({ message: 'Emergency alert not found' });

        await emergency.deleteOne();
        res.json({ message: 'Emergency log deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error deleting emergency', error: err.message });
    }
};

