import React, { useState, useEffect } from 'react';
import { Siren, Loader2, MapPin, Phone, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PartnerEmergencies = () => {
    const { user } = useAuth();
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const fetchEmergencies = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/partner/emergency`, {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Siren className="w-8 h-8 text-red-500" /> My SOS History
                </h1>
                <p className="text-gray-500 mt-1">A log of all emergency alerts you have triggered.</p>
            </div>

            {emergencies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-500">No Emergencies Triggered</h3>
                    <p className="text-gray-400 mt-2">You haven't initiated any SOS alerts.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {emergencies.map((alert) => (
                        <div key={alert._id} className={`bg-white rounded-xl border-2 shadow-sm p-5 transition-all ${alert.status === 'Active' ? 'border-red-200' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.status === 'Active' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                                        {alert.status === 'Active' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-md font-bold text-gray-900 leading-none">Emergency ID: {alert._id.slice(-6).toUpperCase()}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${alert.status === 'Active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {alert.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(alert.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Customer Location at time of alert
                                </h4>
                                <p className="font-bold text-gray-900">{alert.customerName}</p>
                                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {alert.customerPhone}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {alert.customerAddress}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartnerEmergencies;
