import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, CalendarDays, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const BookingSuccess = () => {
    const { state } = useLocation();
    const { bookings = [], date, timeSlot } = state || {};

    const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-lg mx-auto px-6 py-16 text-center">

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-14 h-14 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
                <p className="text-gray-500 mb-8">
                    Thank you! Your booking has been received. Our professional will arrive on time.
                </p>

                {/* Booking Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left mb-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                        <CalendarDays className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold">{formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">Time Slot</p>
                            <p className="font-semibold">{timeSlot}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                        {bookings.map((b, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700 font-medium">{b.service?.title || 'Service'}</span>
                                <span className="font-bold text-gray-900">₹{b.totalAmount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition flex items-center gap-2 justify-center"
                    >
                        Back to Home <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/my-bookings"
                        className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        View My Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
