import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Send, Clock, CheckCircle, Loader2, Trash2 } from 'lucide-react';

const PartnerSupport = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state for creating new ticket
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    // Reply State
    const [replyText, setReplyText] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/partner/support`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) setTickets(data);
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/partner/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ subject, description })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to submit ticket');

            setSuccess('Your support ticket has been submitted. We will get back to you soon.');
            setSubject('');
            setDescription('');
            fetchTickets(); // Refresh list

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (ticketId, e) => {
        e.preventDefault();
        const text = replyText[ticketId];
        if (!text || !text.trim()) return;

        setReplyingTo(ticketId);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/partner/support/${ticketId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ text })
            });

            if (!res.ok) throw new Error('Failed to send reply');

            // Clear input and refresh
            setReplyText({ ...replyText, [ticketId]: '' });
            fetchTickets();
        } catch (err) {
            alert(err.message);
        } finally {
            setReplyingTo(null);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this resolved ticket?')) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/partner/support/${ticketId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (!res.ok) throw new Error('Failed to delete ticket');

            // Remove ticket from list
            setTickets(tickets.filter(t => t._id !== ticketId));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                    <p className="text-gray-500">Raise an issue or track your existing support requests.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Raise a New Ticket</h2>

                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select an issue category</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="Booking Cancellation">Booking Cancellation</option>
                                    <option value="Customer Unresponsive">Customer Unresponsive</option>
                                    <option value="App Bug / Technical Issue">App Bug / Technical Issue</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition text-sm min-h-[120px]"
                                    placeholder="Explain your issue in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Ticket
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Ticket History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 px-1">Your Support History</h2>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-white border p-12 rounded-2xl text-center">
                            <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No support tickets found.</p>
                            <p className="text-sm text-gray-400 mt-1">If you face any issues, raise a ticket from the left panel.</p>
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                                <div className="flex justify-between items-start mb-4 pr-8">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Ticket ID: {ticket._id} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {ticket.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                        {ticket.status}
                                    </span>
                                </div>

                                {ticket.status === 'Resolved' && (
                                    <button
                                        onClick={() => handleDeleteTicket(ticket._id)}
                                        className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                        title="Delete Ticket"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Chat Messages Thread */}
                                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {ticket.messages && ticket.messages.map((msg, index) => (
                                        <div key={index} className={`flex flex-col ${msg.sender === 'Partner' ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-1.5 mb-1 px-1">
                                                {msg.sender === 'Admin' && <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">A</div>}
                                                <span className="text-xs font-semibold text-gray-500">{msg.sender === 'Partner' ? 'You' : 'Admin'}</span>
                                            </div>
                                            <div className={`p-3.5 rounded-2xl text-sm max-w-[85%] whitespace-pre-wrap shadow-sm border ${msg.sender === 'Partner'
                                                ? 'bg-primary text-white border-primary/20 rounded-tr-sm'
                                                : 'bg-gray-50 text-gray-800 border-gray-100 rounded-tl-sm'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Input Box */}
                                {ticket.status === 'Open' ? (
                                    <form onSubmit={(e) => handleReply(ticket._id, e)} className="mt-4 flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type a reply..."
                                            className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                            value={replyText[ticket._id] || ''}
                                            onChange={(e) => setReplyText({ ...replyText, [ticket._id]: e.target.value })}
                                            disabled={replyingTo === ticket._id}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!replyText[ticket._id]?.trim() || replyingTo === ticket._id}
                                            className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {replyingTo === ticket._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="mt-4 bg-gray-50 border p-3 rounded-xl text-center">
                                        <span className="text-xs font-medium text-gray-500">This ticket has been resolved and is closed for replies.</span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default PartnerSupport;
