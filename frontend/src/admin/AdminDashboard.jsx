import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Package, TrendingUp, Clock } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, sub, path }) => {
    const cardContent = (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 ${path ? 'hover:shadow-md hover:border-gray-200 transition-all cursor-pointer' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );

    return path ? <Link to={path} className="block">{cardContent}</Link> : cardContent;
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${user?.token}` }
        })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [user]);

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name} 👋</p>
            </div>

            {loading ? (
                <div className="text-gray-400 text-sm">Loading stats...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    <StatCard label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} icon={TrendingUp} color="bg-green-500" sub="Excluding cancelled" path="/admin/bookings" />
                    <StatCard label="Total Bookings" value={stats?.totalBookings || 0} icon={BookOpen} color="bg-blue-500" path="/admin/bookings" />
                    <StatCard label="Pending Bookings" value={stats?.pendingBookings || 0} icon={Clock} color="bg-yellow-500" sub="Awaiting confirmation" path="/admin/bookings" />
                    <StatCard label="Total Customers" value={stats?.totalUsers || 0} icon={Users} color="bg-purple-500" path="/admin/customers" />
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Manage Bookings', sub: 'View & update all bookings', path: '/admin/bookings', color: 'bg-blue-50 hover:bg-blue-100' },
                    { label: 'Manage Services', sub: 'Add, edit or remove services', path: '/admin/services', color: 'bg-green-50 hover:bg-green-100' },
                    { label: 'Manage Categories', sub: 'Add or remove categories', path: '/admin/categories', color: 'bg-purple-50 hover:bg-purple-100' },
                ].map(card => (
                    <Link key={card.path} to={card.path} className={`block p-5 rounded-2xl border border-gray-100 transition ${card.color}`}>
                        <p className="font-bold text-gray-900 mb-1">{card.label}</p>
                        <p className="text-sm text-gray-500">{card.sub}</p>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
