import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Loader2 } from 'lucide-react';

const AdminCategories = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', icon: '' });
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`);
        setCategories(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleAdd = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            const colors = [
                { color: 'text-purple-600', bg: 'bg-purple-100' },
                { color: 'text-blue-600', bg: 'bg-blue-100' },
                { color: 'text-green-600', bg: 'bg-green-100' },
                { color: 'text-orange-600', bg: 'bg-orange-100' }
            ];
            const randomStyle = colors[Math.floor(Math.random() * colors.length)];

            const payload = {
                ...form,
                color: randomStyle.color,
                bg: randomStyle.bg
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setForm({ name: '', icon: '' });
                await fetchCategories();
            } else {
                alert(data.message || 'Failed to add category');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/categories/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCategories(prev => prev.filter(c => c._id !== id));
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-gray-500 text-sm mt-1">Manage service categories shown on the homepage.</p>
            </div>

            {/* Add Category Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <h2 className="font-bold text-gray-900 mb-4">Add New Category</h2>
                <div className="flex flex-col sm:flex-row items-end gap-3 flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Pest Control"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div className="w-full sm:w-32">
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Icon (emoji)</label>
                        <input
                            type="text"
                            value={form.icon}
                            onChange={e => setForm({ ...form, icon: e.target.value })}
                            placeholder="🐛"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={saving || !form.name.trim()}
                        className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60 text-sm w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                    </button>
                </div>
            </div>

            {/* Categories List */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-10">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Icon', 'Category Name', 'ID', 'Action'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map(c => (
                                <tr key={c._id} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-4 text-2xl">{c.icon || '📦'}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-gray-400">{c._id}</td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => handleDelete(c._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCategories;
