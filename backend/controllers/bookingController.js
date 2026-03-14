import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc  Create a new booking
// @route POST /api/bookings
export const createBooking = async (req, res) => {
    const { service, customerName, customerPhone, address, date, timeSlot, totalAmount } = req.body;

    try {
        const serviceDoc = await Service.findById(service);
        if (!serviceDoc) return res.status(404).json({ message: 'Service not found' });

        if (serviceDoc.allowedPincodes && serviceDoc.allowedPincodes.length > 0) {
            if (!serviceDoc.allowedPincodes.includes(address.pincode)) {
                return res.status(400).json({ message: `This service is currently not available in your area (${address.pincode}).` });
            }
        }

        const startOTP = Math.floor(1000 + Math.random() * 9000).toString();
        const endOTP = Math.floor(1000 + Math.random() * 9000).toString();

        const booking = await Booking.create({
            user: req.user._id,
            service,
            customerName,
            customerPhone,
            address,
            date,
            timeSlot,
            totalAmount,
            startOTP,
            endOTP
        });

        const populated = await booking.populate('service', 'title price image');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Booking failed', error: error.message });
    }
};

// @desc  Get logged-in user's bookings
// @route GET /api/bookings/my
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('service', 'title price image category')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc  Cancel a booking (only if status is pending)
// @route PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
