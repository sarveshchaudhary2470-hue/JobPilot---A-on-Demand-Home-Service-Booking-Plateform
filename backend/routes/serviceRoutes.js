import express from 'express';
import { getServices, getServiceById } from '../controllers/serviceController.js';
import Banner from '../models/Banner.js';

const router = express.Router();

router.get('/banners', async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners' });
    }
});

router.route('/').get(getServices);
router.route('/:id').get(getServiceById);

export default router;
