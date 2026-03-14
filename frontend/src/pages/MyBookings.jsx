import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
    CalendarDays, Clock, MapPin, Package, Loader2,
    ChevronDown, ChevronUp, XCircle, AlertTriangle, Star, CheckCircle2, KeyRound
} from 'lucide-react';

const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_LABELS = {
    pending: '⏳ Pending',
    confirmed: '✅ Confirmed',
    'in-progress': '🔧 In Progress',
    completed: '🎉 Completed',
    cancelled: '❌ Cancelled',
};

const CancelModal = ({ onConfirm, onClose, loading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h2>
            <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                >
                    Keep Booking
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Yes, Cancel
                </button>
            </div>
        </div>
    </div>
);

const ReviewModal = ({ booking, onConfirm, onClose, loading }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Rate your experience</h2>
                <p className="text-gray-500 text-sm mb-6">
                    How was the service provided for <strong>{booking.service?.title}</strong>?
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star className={`w-10 h-10 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked (Optional)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm mb-6 resize-none h-24"
                ></textarea>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => onConfirm(rating, comment)}
                        disabled={loading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingCard = ({ booking, onCancel }) => {
    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [reviewed, setReviewed] = useState(false);
    const { user } = useAuth();

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/bookings/${booking._id}/cancel`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            onCancel(booking._id); // update parent list
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelling(false);
            setShowModal(false);
        }
    };

    const handleReviewSubmit = async (rating, comment) => {
        setCancelling(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    serviceId: booking.service?._id,
                    bookingId: booking._id,
                    rating,
                    comment: comment || 'Great service!' // Default if empty
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setReviewed(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelling(false);
            setShowReviewModal(false);
        }
    };

    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <>
            {showModal && (
                <CancelModal
                    onConfirm={handleCancel}
                    onClose={() => setShowModal(false)}
                    loading={cancelling}
                />
            )}

            {showReviewModal && (
                <ReviewModal
                    booking={booking}
                    onConfirm={handleReviewSubmit}
                    onClose={() => setShowReviewModal(false)}
                    loading={cancelling}
                />
            )}

            <div className={`bg-white rounded-2xl shadow-sm border transition-all overflow-hidden ${expanded ? 'border-primary/30' : 'border-gray-100'}`}>
                {/* Header Row — always visible, clickable to expand */}
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                    <img
                        src={booking.service?.image}
                        alt={booking.service?.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base">{booking.service?.title || 'Service'}</h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">#{booking._id}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                        <p className="font-bold text-lg text-gray-900">₹{booking.totalAmount}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}>
                            {STATUS_LABELS[booking.status]}
                        </span>
                    </div>
                    <div className="text-gray-400 ml-2">
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </button>

                {/* Expanded Detail Panel */}
                {expanded && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">
                        {/* Date, Time, Address */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                                    <CalendarDays className="w-3.5 h-3.5 text-primary" /> Date
                                </div>
                                <p className="font-semibold text-gray-800 text-sm">{formattedDate}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                                    <Clock className="w-3.5 h-3.5 text-primary" /> Time Slot
                                </div>
                                <p className="font-semibold text-gray-800 text-sm">{booking.timeSlot}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                                    <MapPin className="w-3.5 h-3.5 text-primary" /> Address
                                </div>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {booking.address?.houseNo}, {booking.address?.area},<br />
                                    {booking.address?.city} — {booking.address?.pincode}
                                </p>
                            </div>
                        </div>

                        {/* Secure Secure OTP Verification Codes */}
                        {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in-progress') && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                                        <KeyRound className="w-4 h-4 text-indigo-600" />
                                        {booking.status === 'in-progress' ? 'Completion PIN' : 'Job Start PIN'}
                                    </h4>
                                    <p className="text-xs text-indigo-700">
                                        {booking.status === 'in-progress'
                                            ? 'Share this PIN with the partner ONLY when the job is fully completed.'
                                            : 'Share this PIN with the partner when they arrive to officially start the job.'}
                                    </p>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-lg border border-indigo-200 shadow-sm text-lg font-bold tracking-widest text-indigo-700">
                                    {booking.status === 'in-progress' ? booking.endOTP : booking.startOTP}
                                </div>
                            </div>
                        )}

                        {/* Booking booked on */}
                        <p className="text-xs text-gray-400">
                            Booked on: {new Date(booking.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>

                        {/* Cancel button — only if pending */}
                        {booking.status === 'pending' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-4 py-2.5 rounded-xl transition"
                            >
                                <XCircle className="w-4 h-4" /> Cancel This Booking
                            </button>
                        )}

                        {/* Review button — only if completed and not reviewed yet */}
                        {booking.status === 'completed' && !reviewed && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary border border-primary/20 hover:border-primary/50 hover:bg-primary/5 px-4 py-2.5 rounded-xl transition"
                            >
                                <Star className="w-4 h-4" /> Leave a Review
                            </button>
                        )}
                        {reviewed && (
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                <CheckCircle2 className="w-4 h-4" /> Review Submitted
                            </span>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/bookings/my`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    // Update a booking's status locally after cancel (no refetch needed)
    const handleCancelled = (bookingId) => {
        setBookings(prev =>
            prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6 text-primary" /> My Bookings
                </h1>

                {loading && (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading your bookings...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-5 py-4 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Package className="w-16 h-16 text-gray-200 mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 mb-1">No bookings yet</h2>
                        <p className="text-gray-500 mb-5 text-sm">Browse services and book your first appointment.</p>
                        <Link to="/" className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition">
                            Browse Services
                        </Link>
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                onCancel={handleCancelled}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
