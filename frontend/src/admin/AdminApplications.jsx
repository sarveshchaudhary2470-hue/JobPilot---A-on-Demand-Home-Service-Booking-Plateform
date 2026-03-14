import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle, Eye, AlertCircle, FileText, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // stores ID of app being processed
    const [selectedApp, setSelectedApp] = useState(null); // for modal
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/applications', {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            const data = await res.json();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;

        setActionLoading(id);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/applications/${id}/${action}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            if (res.ok) {
                // Remove from pending locally
                setApplications(prev => prev.map(app =>
                    app._id === id ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' } : app
                ));
                if (selectedApp?._id === id) setSelectedApp(null); // close modal if open
            } else {
                const data = await res.json();
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(`Failed to ${action} application`, error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredApps = applications.filter(app => app.status === activeTab);

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Partner Applications</h1>
                    <p className="text-sm text-gray-500 mt-1">Review and manage professional onboarding requests.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    {['pending', 'approved', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No {activeTab} applications</h3>
                    <p className="text-sm text-gray-500 mt-1">When partners apply, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {filteredApps.map(app => (
                            <motion.div
                                key={app._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                            {app.name}
                                            {app.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Mail className="w-3.5 h-3.5" /> {app.email}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-5">
                                    <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-gray-400" /> {app.phone}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> Pincode: {app.pincode}</span>
                                </div>

                                {activeTab === 'pending' ? (
                                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => handleAction(app._id, 'reject')}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 py-2 px-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(app._id, 'approve')}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition flex justify-center items-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            Approve
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-sm font-medium">
                                        <span className="text-gray-500">Status:</span>
                                        {activeTab === 'approved' ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Approved</span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" /> Rejected</span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Details Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                            className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                                    <p className="text-sm text-gray-500 mt-1">Submitted on {new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition"><XCircle className="w-6 h-6" /></button>
                            </div>

                            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Applicant Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                            <p className="font-semibold text-gray-900">{selectedApp.name}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                                            <p className="font-semibold text-gray-900">{selectedApp.phone}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                                            <p className="text-xs text-gray-500 mb-1">Email</p>
                                            <p className="font-semibold text-gray-900">{selectedApp.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="font-medium text-gray-900">{selectedApp.addressLine1}</p>
                                        {selectedApp.addressLine2 && <p className="font-medium text-gray-900">{selectedApp.addressLine2}</p>}
                                        <p className="text-sm text-gray-500 mt-1">{selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}</p>
                                    </div>
                                </div>

                                {/* Identity */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Identity Documents</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                                            <div>
                                                <p className="text-xs text-blue-500/80 font-semibold mb-1 uppercase tracking-wide">Aadhar No.</p>
                                                <p className="font-bold text-gray-900 tracking-wide">{selectedApp.aadharNumber}</p>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-purple-500 shrink-0" />
                                            <div>
                                                <p className="text-xs text-purple-500/80 font-semibold mb-1 uppercase tracking-wide">PAN No.</p>
                                                <p className="font-bold text-gray-900 tracking-wide">{selectedApp.panNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Services Offered</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedApp.servicesOffered.map((service, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{service}</span>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Modal Actions */}
                            {selectedApp.status === 'pending' && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                                    <button
                                        onClick={() => handleAction(selectedApp._id, 'reject')}
                                        disabled={actionLoading === selectedApp._id}
                                        className="flex-1 py-3 px-4 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition"
                                    >
                                        Reject Application
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedApp._id, 'approve')}
                                        disabled={actionLoading === selectedApp._id}
                                        className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition flex justify-center items-center gap-2"
                                    >
                                        {actionLoading === selectedApp._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        Approve & Create Account
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    );
};

export default AdminApplications;
