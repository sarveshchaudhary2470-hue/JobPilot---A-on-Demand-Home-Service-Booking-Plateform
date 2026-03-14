import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Plus, Trash2, Users, Search, X, ShieldAlert, ShieldCheck, Eye } from 'lucide-react';

const AdminPartners = () => {
    const { user } = useAuth();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Form Modal state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    // View Details Modal State
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [partnerDetailsLoading, setPartnerDetailsLoading] = useState(false);

    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPartners();
    }, [user]);

    const handleViewDetails = async (partnerId, e) => {
        if (e) e.stopPropagation();
        setPartnerDetailsLoading(true);
        // Set a basic object first to open the modal quickly
        setSelectedPartner(partners.find(p => p._id === partnerId));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/partners/${partnerId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedPartner(data);
            }
        } catch (error) {
            console.error("Failed to fetch partner details", error);
        } finally {
            setPartnerDetailsLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/partners`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            const data = await res.json();
            setPartners(data);
        } catch (error) {
            console.error("Failed to fetch partners", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePartner = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/partners`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setPartners([data, ...partners]);
                setShowForm(false);
                setFormData({ name: '', email: '', phone: '', password: '' });
            } else {
                alert(data.message || 'Failed to create partner');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this partner?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/partners/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            if (res.ok) {
                setPartners(partners.filter(p => p._id !== id));
                if (selectedPartner?._id === id) setSelectedPartner(null);
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete partner');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setProcessingId(null);
        }
    };

    const handleToggleSuspend = async (id, currentStatus, e) => {
        if (e) e.stopPropagation();
        const action = currentStatus ? 'activate' : 'suspend';
        if (!window.confirm(`Are you sure you want to ${action} this partner?`)) return;

        setProcessingId(id);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/partners/${id}/suspend`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPartners(partners.map(p => p._id === id ? { ...p, suspended: data.suspended } : p));
                if (selectedPartner?._id === id) {
                    setSelectedPartner(prev => ({ ...prev, suspended: data.suspended }));
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            alert('Something went wrong');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, view, and remove service partners.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Partner
                </button>
            </div>

            {/* Header controls: Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search partners by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    />
                </div>
            </div>

            {/* Partners List */}
            {loading ? (
                <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filteredPartners.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="font-medium text-lg text-gray-900">No partners found</p>
                    <p className="text-sm">Get started by adding a new partner.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Partner Info</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPartners.map(partner => (
                                    <tr
                                        key={partner._id}
                                        className="hover:bg-gray-50/50 transition cursor-pointer"
                                        onClick={() => handleViewDetails(partner._id)}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {partner.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{partner.name}</p>
                                                    <p className="text-xs text-gray-500">{partner.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {partner.phone || 'N/A'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : 'New'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${partner.suspended ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                                {partner.suspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => handleViewDetails(partner._id, e)}
                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleToggleSuspend(partner._id, partner.suspended, e)}
                                                    disabled={processingId === partner._id}
                                                    className={`p-1.5 rounded-lg transition disabled:opacity-50 inline-flex items-center justify-center ${partner.suspended ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                                                    title={partner.suspended ? "Activate Partner" : "Suspend Partner"}
                                                >
                                                    {processingId === partner._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (partner.suspended ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />)}
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(partner._id, e)}
                                                    disabled={processingId === partner._id}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 inline-flex items-center justify-center"
                                                    title="Delete Partner"
                                                >
                                                    {processingId === partner._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">Add New Partner</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-200 rounded-lg transition">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePartner} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
                                <input
                                    required
                                    type="password"
                                    minLength="6"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-sm transition shadow flex justify-center items-center"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Partner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedPartner && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-900">Partner Details</h3>
                            <button onClick={() => setSelectedPartner(null)} className="p-1 hover:bg-gray-200 rounded-lg transition">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                                    {selectedPartner.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-gray-900">{selectedPartner.name}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${selectedPartner.suspended ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'} mt-1 inline-block`}>
                                        {selectedPartner.suspended ? 'Suspended Account' : 'Active Account'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="font-medium text-gray-900">{selectedPartner.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="font-medium text-gray-900">{selectedPartner.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined On</p>
                                    <p className="font-medium text-gray-900">{selectedPartner.createdAt ? new Date(selectedPartner.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner ID</p>
                                    <p className="font-mono text-xs text-gray-500">{selectedPartner._id}</p>
                                </div>
                            </div>

                            {partnerDetailsLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : selectedPartner.application && (
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-4">
                                    <h5 className="font-bold text-sm text-blue-800 border-b border-blue-100 pb-2">Registration Documents & Details</h5>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aadhar Number</p>
                                            <p className="font-medium text-gray-900 text-sm tracking-wide">{selectedPartner.application.aadharNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PAN Number</p>
                                            <p className="font-medium text-gray-900 text-sm tracking-wide">{selectedPartner.application.panNumber}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Full Address</p>
                                        <div className="text-sm text-gray-800 bg-white p-2.5 rounded-lg border border-gray-200">
                                            <p>{selectedPartner.application.addressLine1}</p>
                                            {selectedPartner.application.addressLine2 && <p>{selectedPartner.application.addressLine2}</p>}
                                            <p>{selectedPartner.application.city}, {selectedPartner.application.state} - {selectedPartner.application.pincode}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Approved Services</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedPartner.application.servicesOffered?.map((srv, idx) => (
                                                <span key={idx} className="bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm">
                                                    {srv}
                                                </span>
                                            ))}
                                            {(!selectedPartner.application.servicesOffered || selectedPartner.application.servicesOffered.length === 0) && (
                                                <span className="text-sm text-gray-500">No specific services listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={(e) => handleToggleSuspend(selectedPartner._id, selectedPartner.suspended, e)}
                                    disabled={processingId === selectedPartner._id}
                                    className={`flex-1 py-2.5 font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 ${selectedPartner.suspended ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200' : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'}`}
                                >
                                    {processingId === selectedPartner._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            {selectedPartner.suspended ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                            {selectedPartner.suspended ? 'Reactivate' : 'Suspend'}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => handleDelete(selectedPartner._id, e)}
                                    disabled={processingId === selectedPartner._id}
                                    className="flex-1 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                                >
                                    {processingId === selectedPartner._id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPartners;
