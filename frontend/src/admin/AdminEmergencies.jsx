import React, { useState, useEffect } from 'react';
import { Siren, Search, Loader2, MapPin, Phone, User as UserIcon, CheckCircle2, AlertTriangle, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminEmergencies = () => {
    const { user } = useAuth();
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const fetchEmergencies = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/emergencies`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEmergencies(data);
            }
        } catch (error) {
            console.error('Failed to fetch emergencies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        if (!window.confirm('Are you sure you want to mark this emergency as resolved?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/emergencies/${id}/resolve`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                setEmergencies(emergencies.map(e => e._id === id ? { ...e, status: 'Resolved' } : e));
            }
        } catch (error) {
            alert('Failed to resolve emergency');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this emergency log?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/emergencies/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                setEmergencies(emergencies.filter(e => e._id !== id));
            }
        } catch (error) {
            alert('Failed to delete emergency log');
        }
    };

    const filteredEmergencies = emergencies.filter(e => filter === 'All' || e.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Siren className="w-8 h-8 text-red-500" /> SOS Emergency Logs
                    </h1>
                    <p className="text-gray-500 mt-1">History of all partner panic button alerts.</p>
                </div>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden font-medium text-sm">
                    {['All', 'Active', 'Resolved'].map((stat) => (
                        <button
                            key={stat}
                            onClick={() => setFilter(stat)}
                            className={`px-4 py-2 transition ${filter === stat ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            {stat}
                        </button>
                    ))}
                </div>
            </div>

            {filteredEmergencies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-500">No {filter !== 'All' ? filter : ''} Emergencies Found</h3>
                    <p className="text-gray-400 mt-2">The emergency log is empty.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredEmergencies.map((alert) => (
                        <div key={alert._id} className={`bg-white rounded-2xl border-2 shadow-sm p-6 transition-all ${alert.status === 'Active' ? 'border-red-200 shadow-red-500/10' : 'border-gray-100 opacity-80'}`}>
                            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.status === 'Active' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                                        {alert.status === 'Active' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900 leading-none">Emergency ID: {alert._id.slice(-6).toUpperCase()}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${alert.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {alert.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(alert.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                {alert.status === 'Active' && (
                                    <button
                                        onClick={() => handleResolve(alert._id)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-green-500/20 text-sm"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                                {alert.status === 'Resolved' && (
                                    <button
                                        onClick={() => handleDelete(alert._id)}
                                        className="text-gray-400 hover:bg-red-50 hover:text-red-500 p-2.5 rounded-xl transition-colors shrink-0"
                                        title="Delete Log"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Partner Details */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <UserIcon className="w-3.5 h-3.5" /> Partner Profile
                                    </h4>
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50/50">
                                        <p className="font-bold text-gray-900 text-lg">{alert.partner?.name}</p>
                                        <p className="text-sm font-semibold text-gray-700 mt-1 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-blue-500" /> {alert.partner?.phone}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {alert.partner?._id}</p>
                                    </div>
                                </div>

                                {/* Customer/Location Details */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> Customer Location
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-full">
                                        <p className="font-bold text-gray-900">{alert.customerName}</p>
                                        <p className="text-sm font-semibold text-gray-700 mt-1 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {alert.customerPhone}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-3 leading-relaxed border-t border-gray-200 pt-3">
                                            <span className="font-semibold block text-gray-800 mb-0.5">Address:</span>
                                            {alert.customerAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminEmergencies;
