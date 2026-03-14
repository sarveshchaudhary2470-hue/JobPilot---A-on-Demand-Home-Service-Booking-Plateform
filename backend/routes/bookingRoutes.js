import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/my').get(protect, getMyBookings);
router.route('/:id/cancel').patch(protect, cancelBooking);

export default router;
