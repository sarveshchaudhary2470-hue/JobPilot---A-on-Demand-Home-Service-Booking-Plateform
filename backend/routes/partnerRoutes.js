import express from 'express';
import { getPartnerJobs, updateJobStatus, submitApplication, createSupportTicket, getMySupportTickets, replySupportTicket, deleteSupportTicket, triggerEmergency, getMyEmergencies } from '../controllers/partnerController.js';
import { protect, partnerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for partner registration
router.post('/apply', submitApplication);

router.route('/jobs')
    .get(protect, partnerOnly, getPartnerJobs);

router.route('/jobs/:id/status')
    .patch(protect, partnerOnly, updateJobStatus);

router.route('/support')
    .post(protect, partnerOnly, createSupportTicket)
    .get(protect, partnerOnly, getMySupportTickets);

router.post('/support/:id/reply', protect, partnerOnly, replySupportTicket);
router.delete('/support/:id', protect, partnerOnly, deleteSupportTicket);

router.route('/emergency')
    .post(protect, partnerOnly, triggerEmergency)
    .get(protect, partnerOnly, getMyEmergencies);

export default router;
