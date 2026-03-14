import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import {
    Loader2, ChevronDown, ChevronUp, Trash2,
    CalendarDays, Clock, MapPin, User, Phone, Mail
} from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    'in-progress': 'bg-purple-50 text-purple-700 border-purple-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const BookingRow = ({ booking, partners, onStatusChange, onDelete, updating, deleting }) => {
    const [expanded, setExpanded] = useState(false);

    const formattedDate = booking.date
        ? new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    const bookedOn = booking.createdAt
        ? new Date(booking.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—';

    return (
        <>
            {/* Main row */}
            <tr
                className={`hover:bg-gray-50/60 cursor-pointer transition-colors ${expanded ? 'bg-primary/5' : ''}`}
                onClick={() => setExpanded(e => !e)}
            >
                <td className="px-5 py-4">
                    <div>
                        <p className="font-semibold text-gray-900">{booking.customerName || booking.user?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{booking.customerPhone || booking.user?.phone}</p>
                    </div>
                </td>
                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        {booking.service?.image && (
                            <img src={booking.service.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <span className="font-medium text-gray-800 max-w-[130px] truncate">{booking.service?.title || '—'}</span>
                    </div>
                </td>
                <td className="px-5 py-4 text-gray-600 text-sm">
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                </td>
                <td className="px-5 py-4 text-gray-600 text-xs">{booking.timeSlot || '—'}</td>
                <td className="px-5 py-4 font-bold text-gray-900">₹{booking.totalAmount}</td>
                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                    </span>
                </td>
                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    {/* ASSIGN PARTNER DROPDOWN */}
                    {booking.assignedTo ? (
                        <div className="flex flex-col text-xs">
                            <span className="font-semibold text-gray-800">{booking.assignedTo.name}</span>
                            <span className="text-gray-400">Assigned</span>
                        </div>
                    ) : (
                        <select
                            onChange={e => onStatusChange(booking._id, 'assign', e.target.value)}
                            disabled={updating === booking._id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 bg-white"
                        >
                            <option value="">Assign Partner</option>
                            {partners.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    )}
                </td>
                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        <select
                            value={booking.status}
                            onChange={e => onStatusChange(booking._id, 'status', e.target.value)}
                            disabled={updating === booking._id}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 bg-white font-medium"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                            onClick={() => onDelete(booking._id)}
                            disabled={deleting === booking._id}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete booking"
                        >
                            {deleting === booking._id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />}
                        </button>
                        <span className="text-gray-300">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                    </div>
                </td>
            </tr>

            {/* Expanded detail row */}
            {expanded && (
                <tr className="bg-primary/5 border-b border-primary/10">
                    <td colSpan={7} className="px-6 py-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {/* Work Evidence - Before/After */}
                            {(booking.beforeImage || booking.afterImage) && (
                                <div className="bg-white rounded-xl p-4 shadow-sm sm:col-span-2 lg:col-span-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">📸 Work Evidence (Dispute Resolution)</p>
                                    <div className="flex flex-wrap gap-4">
                                        {booking.beforeImage && (
                                            <div className="flex-1 min-w-[140px] max-w-[220px]">
                                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1.5">⬤ Before Work</p>
                                                <a href={booking.beforeImage} target="_blank" rel="noopener noreferrer">
                                                    <img src={booking.beforeImage} alt="Before" className="w-full h-32 object-cover rounded-lg border-2 border-red-300 hover:border-red-500 transition cursor-pointer" />
                                                </a>
                                            </div>
                                        )}
                                        {booking.afterImage && (
                                            <div className="flex-1 min-w-[140px] max-w-[220px]">
                                                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1.5">⬤ After Work</p>
                                                <a href={booking.afterImage} target="_blank" rel="noopener noreferrer">
                                                    <img src={booking.afterImage} alt="After" className="w-full h-32 object-cover rounded-lg border-2 border-green-300 hover:border-green-500 transition cursor-pointer" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Customer Info */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                                <div className="space-y-1.5 text-sm text-gray-700">
                                    <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary" />{booking.customerName || booking.user?.name || '—'}</div>
                                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" />{booking.customerPhone || booking.user?.phone || '—'}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-default" />{booking.user?.email || '—'}</div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Schedule</p>
                                <div className="space-y-1.5 text-sm text-gray-700">
                                    <div className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 text-primary" />{formattedDate}</div>
                                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" />{booking.timeSlot || '—'}</div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Address</p>
                                <div className="flex items-start gap-2 text-sm text-gray-700">
                                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                    <span>
                                        {booking.address?.addressLine1}{booking.address?.addressLine2 ? `, ${booking.address.addressLine2}` : ''},<br />
                                        {booking.address?.city}, {booking.address?.state} – {booking.address?.pincode}
                                    </span>
                                </div>
                            </div>

                            {/* Booking Meta */}
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Booking Info</p>
                                <div className="space-y-1.5 text-sm text-gray-700">
                                    <p><span className="text-gray-400">Amount:</span> <strong>₹{booking.totalAmount}</strong></p>
                                    <p><span className="text-gray-400">Booked on:</span> {bookedOn}</p>
                                    <p className="font-mono text-[10px] text-gray-400 truncate">ID: {booking._id}</p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const AdminBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bRes, pRes] = await Promise.all([
                    fetch('http://localhost:5000/api/admin/bookings', { headers: { Authorization: `Bearer ${user?.token}` } }),
                    fetch('http://localhost:5000/api/admin/partners', { headers: { Authorization: `Bearer ${user?.token}` } })
                ]);
                setBookings(await bRes.json());
                setPartners(await pRes.json());
            } catch (err) {
                console.error("Failed to fetch admin data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleStatusChange = async (bookingId, type, val) => {
        setUpdating(bookingId);
        try {
            let url, method, body;

            if (type === 'status') {
                url = `http://localhost:5000/api/admin/bookings/${bookingId}/status`;
                method = 'PATCH';
                body = JSON.stringify({ status: val });
            } else if (type === 'assign') {
                if (!val) { setUpdating(null); return; } // Empty assign
                url = `http://localhost:5000/api/admin/bookings/${bookingId}/assign`;
                method = 'PATCH';
                body = JSON.stringify({ partnerId: val });
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                body
            });
            const updated = await res.json();

            // Sync with UI
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: updated.status, assignedTo: updated.assignedTo } : b));
        } catch { alert('Failed to update booking'); }
        finally { setUpdating(null); }
    };

    const handleDelete = async (bookingId) => {
        if (!window.confirm('Delete this booking permanently?')) return;
        setDeleting(bookingId);
        try {
            await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch { alert('Failed to delete booking'); }
        finally { setDeleting(null); }
    };

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Click any row to see full details</p>
                </div>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-10">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading bookings...
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-gray-500 text-sm py-10">No bookings found.</p>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Customer', 'Service', 'Date', 'Slot', 'Amount', 'Status', 'Assigned To', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(booking => (
                                <BookingRow
                                    key={booking._id}
                                    booking={booking}
                                    partners={partners}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                    updating={updating}
                                    deleting={deleting}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBookings;
