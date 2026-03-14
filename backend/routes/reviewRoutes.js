import express from 'express';
import { getServiceReviews, createReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/service/:serviceId', getServiceReviews);
router.post('/', protect, createReview);

export default router;
