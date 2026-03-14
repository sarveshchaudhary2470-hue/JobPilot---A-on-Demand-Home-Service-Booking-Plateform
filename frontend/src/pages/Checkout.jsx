import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { MapPin, Clock, CalendarDays, Loader2, User } from 'lucide-react';

const TIME_SLOTS = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

const getNext5Days = () => {
    const days = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push({
            label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
            value: d.toISOString().split('T')[0]
        });
    }
    return days;
};

const Checkout = () => {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [contact, setContact] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [address, setAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const days = getNext5Days();

    const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
    const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

    const handleConfirmBooking = async () => {
        if (!contact.name || !contact.phone) return setError('Please fill in contact details.');
        if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
            return setError('Please fill in all required address fields.');
        }
        if (!selectedDate) return setError('Please select a date.');
        if (!selectedSlot) return setError('Please select a time slot.');

        setLoading(true);
        setError('');

        try {
            // Create one booking per service
            const results = [];
            for (const service of items) {
                const res = await fetch('http://localhost:5000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        service: service._id,
                        customerName: contact.name,
                        customerPhone: contact.phone,
                        address,
                        date: selectedDate,
                        timeSlot: selectedSlot,
                        totalAmount: service.price
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Booking failed');
                results.push(data);
            }

            clearCart();
            navigate('/booking-success', { state: { bookings: results, date: selectedDate, timeSlot: selectedSlot } });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg px-4 py-3 text-sm font-medium mb-5">
                        {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3 space-y-6">

                        {/* Contact Details */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-primary" /> Contact Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Full Name</label>
                                    <input type="text" name="name" value={contact.name} onChange={handleContactChange} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Phone Number</label>
                                    <input type="tel" name="phone" value={contact.phone} onChange={handleContactChange} placeholder="9876543210" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-primary" /> Service Address
                            </h2>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Address Line 1 (House No, Flat, Building) *</label>
                                    <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} placeholder="House No / Flat / Building Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Address Line 2 (Street, Area, Landmark)</label>
                                    <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Street, Area, Village, Landmark" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">City *</label>
                                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="City / District" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">State *</label>
                                    <input type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="State" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Pincode *</label>
                                    <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="e.g. 110001" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                                <CalendarDays className="w-5 h-5 text-primary" /> Select Date
                            </h2>
                            <div className="flex gap-3 flex-wrap">
                                {days.map(day => (
                                    <button
                                        key={day.value}
                                        onClick={() => setSelectedDate(day.value)}
                                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${selectedDate === day.value
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 text-gray-700 hover:border-primary/50'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Slot */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-primary" /> Select Time Slot
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {TIME_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${selectedSlot === slot
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-gray-200 text-gray-700 hover:border-primary/50'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {items.map(s => (
                                    <div key={s._id} className="flex items-center gap-3">
                                        <img src={s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{s.title}</p>
                                            <p className="text-xs text-gray-500">₹{s.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-lg mb-5">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2 text-base"
                            >
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking...</> : 'Confirm Booking 🎉'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
