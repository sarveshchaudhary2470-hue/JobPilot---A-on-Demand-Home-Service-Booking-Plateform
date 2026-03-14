import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Headphones, CheckCircle, Clock, Loader2, Send, Trash2 } from 'lucide-react';

const AdminSupport = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/support', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) setTickets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTicket = async (ticketId, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to permanently delete this ticket?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/support/${ticketId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (!res.ok) throw new Error('Failed to delete ticket');

            // Remove ticket from list
            setTickets(tickets.filter(t => t._id !== ticketId));
            if (selectedTicket?._id === ticketId) closeModal();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleReply = async (statusUpdate) => {
        if (!replyText.trim() && statusUpdate === 'Open') return;
        setReplying(true);

        try {
            const res = await fetch(`http://localhost:5000/api/admin/support/${selectedTicket._id}/reply`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    adminReply: replyText,
                    status: statusUpdate
                })
            });

            if (!res.ok) throw new Error('Failed to update ticket');

            // Refresh
            fetchTickets();
            closeModal();
        } catch (err) {
            alert(err.message);
        } finally {
            setReplying(false);
        }
    };

    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setReplyText('');
        setTimeout(() => scrollToBottom(), 100);
    };

    const closeModal = () => {
        setSelectedTicket(null);
        setReplyText('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Partner Issues & Support
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Resolve issues raised by service partners.</p>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-white border text-center p-12 rounded-2xl shadow-sm">
                    <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No partner support tickets yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex flex-col relative group">
                            <div className="flex justify-between items-start mb-3 pr-6">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {ticket.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                    {ticket.status}
                                </span>
                                <span className="text-xs text-gray-400 font-medium mt-1">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                onClick={(e) => handleDeleteTicket(ticket._id, e)}
                                className="absolute top-5 right-5 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                title="Delete Ticket"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <h3 className="font-bold text-gray-900 leading-tight mb-2">{ticket.subject}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                {ticket.messages && ticket.messages.length > 0 ? ticket.messages[0].text : 'No description provided.'}
                            </p>

                            <hr className="border-gray-100 my-3" />

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">{ticket.partner?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500">{ticket.partner?.phone || 'No phone'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => openModal(ticket)}
                                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition border"
                            >
                                {ticket.status === 'Open' ? 'View & Reply' : 'View Details'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* View / Reply Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                                    <p className="text-sm text-gray-500 mt-1">From: <span className="font-semibold text-gray-800">{selectedTicket.partner?.name}</span> ({selectedTicket.partner?.phone})</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${selectedTicket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col min-h-0 bg-gray-50/50">

                            {/* Chat Thread */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
                                {selectedTicket.messages && selectedTicket.messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-col ${msg.sender === 'Admin' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-1.5 mb-1 px-1">
                                            {msg.sender === 'Partner' && <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold">P</div>}
                                            <span className="text-xs font-semibold text-gray-500">{msg.sender === 'Admin' ? 'You' : selectedTicket.partner?.name || 'Partner'}</span>
                                        </div>
                                        <div className={`p-3.5 rounded-2xl text-sm max-w-[85%] whitespace-pre-wrap shadow-sm border ${msg.sender === 'Admin'
                                            ? 'bg-primary text-white border-primary/20 rounded-tr-sm'
                                            : 'bg-white text-gray-800 border-gray-200 rounded-tl-sm'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input */}
                            <div className="shrink-0 bg-white p-1 rounded-2xl border">
                                {selectedTicket.status === 'Resolved' ? (
                                    <div className="p-3 text-center">
                                        <span className="text-xs font-medium text-gray-500">This ticket is resolved. Reopen to reply.</span>
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full px-3 py-2 border-0 bg-transparent focus:ring-0 outline-none resize-none text-sm min-h-[80px]"
                                        placeholder="Type your reply to the partner..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
                            >
                                Close
                            </button>

                            {selectedTicket.status === 'Open' && (
                                <>
                                    <button
                                        onClick={() => handleReply('Open')}
                                        disabled={replying || !replyText.trim()}
                                        className="px-5 py-2.5 text-sm font-semibold bg-white border shadow-sm hover:bg-gray-50 text-gray-700 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" /> Reply Only
                                    </button>
                                    <button
                                        onClick={() => handleReply('Resolved')}
                                        disabled={replying}
                                        className="px-5 py-2.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-600/20 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Reply & Resolve
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupport;
