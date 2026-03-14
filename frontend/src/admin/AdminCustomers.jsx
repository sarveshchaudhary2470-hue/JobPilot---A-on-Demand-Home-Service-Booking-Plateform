import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Users, Mail, Phone, Calendar, Search, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';

const AdminCustomers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/customers`, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setCustomers(data);
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchCustomers();
        }
    }, [user]);

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

    const handleSuspend = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'activate' : 'suspend'} this customer?`)) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/customers/${id}/suspend`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (res.ok) {
                setCustomers(customers.map(c =>
                    c._id === id ? { ...c, suspended: !c.suspended } : c
                ));
            }
        } catch (err) {
            console.error("Error updating customer status:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this customer account? This cannot be undone.')) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/customers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (res.ok) {
                setCustomers(customers.filter(c => c._id !== id));
            }
        } catch (err) {
            console.error("Error deleting customer:", err);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" /> Total Customers
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage all registered customers</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No customers found</h3>
                    <p className="text-sm text-gray-500">We couldn't find any customers matching your search.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                    <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Contact Docs</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map(customer => (
                                    <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                    {customer.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{customer.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">ID: {customer._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                    {customer.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    {customer.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleSuspend(customer._id, customer.suspended)}
                                                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${customer.suspended
                                                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                                                        }`}
                                                    title={customer.suspended ? "Activate Customer" : "Suspend Customer"}
                                                >
                                                    {customer.suspended ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
        </AdminLayout>
    );
};

export default AdminCustomers;
