import express from 'express';
import {
    getStats,
    getAllBookings, updateBookingStatus, deleteBooking, assignPartner, getAllPartners,
    getPartnerDetails, createPartner, deletePartner, togglePartnerSuspend,
    createService, updateService, deleteService,
    createCategory, deleteCategory,
    getAllBanners, createBanner, updateBanner, deleteBanner,
    getPartnerApplications, approvePartnerApplication, rejectPartnerApplication,
    getAllReviews, deleteReview,
    getSupportTickets, replyToSupportTicket, deleteSupportTicket,
    getEmergencies, resolveEmergency, deleteEmergency,
    getAllCustomers, toggleCustomerSuspend, deleteCustomer
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected + admin-only
router.use(protect, adminOnly);

router.get('/stats', getStats);

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.patch('/bookings/:id/assign', assignPartner);
router.delete('/bookings/:id', deleteBooking);

router.get('/customers', getAllCustomers);
router.patch('/customers/:id/suspend', toggleCustomerSuspend);
router.delete('/customers/:id', deleteCustomer);

router.get('/partners', getAllPartners);
router.get('/partners/:id', getPartnerDetails);
router.post('/partners', createPartner);
router.delete('/partners/:id', deletePartner);
router.patch('/partners/:id/suspend', togglePartnerSuspend);

// Partner Applications
router.get('/applications', getPartnerApplications);
router.patch('/applications/:id/approve', approvePartnerApplication);
router.patch('/applications/:id/reject', rejectPartnerApplication);

router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/banners', getAllBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// Reviews
// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Partner Support Tickets
router.get('/support', getSupportTickets);
router.patch('/support/:id/reply', replyToSupportTicket);
router.delete('/support/:id', deleteSupportTicket);

// SOS Emergencies
router.get('/emergencies', getEmergencies);
router.patch('/emergencies/:id/resolve', resolveEmergency);
router.delete('/emergencies/:id', deleteEmergency);

export default router;
