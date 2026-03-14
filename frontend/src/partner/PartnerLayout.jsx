import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, LogOut, HelpCircle, Siren, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { name: 'Dashboard', path: '/partner', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Jobs', path: '/partner/jobs', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Help & Support', path: '/partner/support', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'SOS Logs', path: '/partner/emergencies', icon: <Siren className="w-5 h-5" /> },
];

const PartnerLayout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [triggeringSOS, setTriggeringSOS] = useState(false);

    const handleSOS = async () => {
        if (!window.confirm('🚨 URGENT: Are you sure you want to trigger an Emergency SOS Alert? This will immediately notify the Admin.')) {
            return;
        }

        setTriggeringSOS(true);
        try {
            const res = await fetch('http://localhost:5000/api/partner/emergency', {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (!res.ok) throw new Error('Failed to trigger SOS');
            alert('SOS Alert Sent Successfully. The Admin has been notified and will contact you shortly.');
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setTriggeringSOS(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col z-50">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <div>
                            <p className="font-bold text-white leading-tight mt-0.5">JobPilot</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Partner Portal</p>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                                    ? 'bg-green-500 text-white font-medium shadow-md shadow-green-500/20'
                                    : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Log Out */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Floating SOS Button */}
            <button
                onClick={handleSOS}
                disabled={triggeringSOS}
                className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl shadow-red-500/50 flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-70 disabled:hover:scale-100"
                title="Trigger Emergency SOS"
            >
                {triggeringSOS ? <Loader2 className="w-8 h-8 animate-spin" /> : <Siren className="w-8 h-8 animate-pulse" />}
            </button>
        </div>
    );
};

export default PartnerLayout;
