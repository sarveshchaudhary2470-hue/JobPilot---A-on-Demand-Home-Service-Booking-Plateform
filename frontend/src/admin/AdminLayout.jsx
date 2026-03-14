import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, BookOpen, Tag, LogOut, ChevronRight, Users,
    Image as ImageIcon, ClipboardList, Star, Headphones, Siren, MapPin, Phone,
    User as UserIcon, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/bookings', label: 'Bookings', icon: BookOpen },
    { path: '/admin/services', label: 'Services', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: Tag },
    { path: '/admin/banners', label: 'Banners', icon: ImageIcon },
    { path: '/admin/partners', label: 'Partners', icon: Users },
    { path: '/admin/applications', label: 'Applications', icon: ClipboardList },
    { path: '/admin/reviews', label: 'Reviews', icon: Star },
    { path: '/admin/support', label: 'Partner Issues', icon: Headphones },
    { path: '/admin/emergencies', label: 'SOS Logs', icon: Siren },
];

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Emergency State
    const [emergencies, setEmergencies] = useState([]);
    const [showSirenModal, setShowSirenModal] = useState(false);
    const audioRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Polling for Emergencies
    useEffect(() => {
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/emergency/emergency_siren_short_burst.ogg');
        audioRef.current.loop = true;

        const checkEmergencies = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch('http://localhost:5000/api/admin/emergencies?status=Active', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEmergencies(data);
                }
            } catch (err) { }
        };

        checkEmergencies();
        const interval = setInterval(checkEmergencies, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

    // Audio Playback effect
    useEffect(() => {
        if (emergencies.length > 0) {
            audioRef.current?.play().catch(e => console.log('Audio autoplay blocked by browser', e));
        } else {
            audioRef.current?.pause();
        }
    }, [emergencies]);

    const handleResolveEmergency = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/emergencies/${id}/resolve`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                setEmergencies(prev => prev.filter(e => e._id !== id));
                if (emergencies.length <= 1) setShowSirenModal(false);
            }
        } catch (err) {
            alert('Failed to resolve emergency');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-60 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">J</div>
                        <div>
                            <p className="font-extrabold text-sm leading-none">JobPilot</p>
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ path, label, icon: Icon }) => {
                        const active = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-60 flex-1 p-8 relative">
                {children}
            </main>

            {/* EMERGENCY SOS BANNER */}
            {emergencies.length > 0 && (
                <div className="fixed top-0 left-60 right-0 h-14 bg-red-600 z-50 flex items-center justify-between px-6 shadow-lg shadow-red-500/30 animate-pulse">
                    <div className="flex items-center gap-3">
                        <Siren className="w-6 h-6 text-white" />
                        <span className="text-white font-black tracking-widest uppercase">Emergency Alert Detected</span>
                    </div>
                    <button
                        onClick={() => setShowSirenModal(true)}
                        className="bg-white text-red-600 px-5 py-2 rounded-lg font-bold hover:bg-red-50 transition shadow-sm flex items-center gap-2 text-sm"
                    >
                        <AlertTriangle className="w-4 h-4" /> View Details & Take Action
                    </button>
                </div>
            )}

            {/* EMERGENCY MODAL */}
            {showSirenModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                        <div className="bg-red-600 p-6 rounded-t-3xl text-left border-b border-red-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Siren className="w-8 h-8 animate-pulse text-white" /> Active Emergencies ({emergencies.length})
                                </h2>
                                <p className="text-red-100 font-medium text-sm mt-1">Partners need immediate assistance</p>
                            </div>
                            <button onClick={() => setShowSirenModal(false)} className="text-white hover:text-red-200 bg-red-700/50 p-2 rounded-xl">
                                Close Window
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4 bg-gray-50 flex-1">
                            {emergencies.map((alert) => (
                                <div key={alert._id} className="bg-white rounded-2xl border-2 border-red-100 p-5 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-red-50/50 p-4 rounded-xl border border-red-50">
                                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <UserIcon className="w-4 h-4" /> Partner Details
                                            </p>
                                            <p className="font-bold text-gray-900 text-lg">{alert.partner?.name}</p>
                                            <p className="text-sm font-semibold text-gray-700 mt-1">{alert.partner?.phone}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" /> Customer Location
                                            </p>
                                            <p className="font-bold text-gray-900 leading-tight">{alert.customerName}</p>
                                            <p className="text-sm font-semibold text-gray-700 mt-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {alert.customerPhone}</p>
                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed bg-white border border-gray-100 p-2 rounded-lg">{alert.customerAddress}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleResolveEmergency(alert._id)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-green-500/20 flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5" /> Mark Partner as Safe / Resolved
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
