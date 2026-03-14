import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Get all reviews for a specific service
// @route   GET /api/reviews/service/:serviceId
export const getServiceReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate('user', 'name')
            .populate('booking', 'beforeImage afterImage')
            .sort({ createdAt: -1 });

        // Calculate average
        const count = reviews.length;
        const average = count === 0
            ? 0
            : reviews.reduce((acc, item) => item.rating + acc, 0) / count;

        res.json({
            reviews,
            count,
            average: Number(average.toFixed(1))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching reviews', error: error.message });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { serviceId, bookingId, rating, comment } = req.body;
        const userId = req.user._id;

        // 1. Verify the booking belongs to the user and is completed
        const booking = await Booking.findOne({ _id: bookingId, user: userId, service: serviceId });
        if (!booking) {
            return res.status(404).json({ message: 'Valid booking not found for this service' });
        }
        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'You can only review completed services' });
        }

        // 2. Check if a review already exists for this exact booking
        const existingReview = await Review.findOne({ booking: bookingId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        // 3. Create the review
        const review = await Review.create({
            user: userId,
            service: serviceId,
            booking: bookingId,
            rating: Number(rating),
            comment
        });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add review', error: error.message });
    }
};
