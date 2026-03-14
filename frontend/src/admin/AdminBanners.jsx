import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Loader2, Image as ImageIcon, Link as LinkIcon, Edit3, X, Check } from 'lucide-react';

const AdminBanners = () => {
    const { user } = useAuth();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [form, setForm] = useState({ image: '', title: '', link: '', isActive: true });
    const [saving, setSaving] = useState(false);

    // File upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/banners`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadImage = async () => {
        if (!selectedFile) return form.image; // Return existing if editing or none selected

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user?.token}` },
                body: formData
            });

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                throw new Error(`Upload failed (${uploadRes.status}): ${errorText.substring(0, 100)}`);
            }

            const uploadData = await uploadRes.json();
            return uploadData.url;
        } catch (error) {
            console.error("Upload error object:", error);
            throw new Error(error.message || "Image upload failed");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedFile && !form.image) {
            alert('Please select an image for the banner');
            return;
        }

        setSaving(true);
        try {
            let imageUrl = await handleUploadImage();

            const payload = {
                ...form,
                image: imageUrl
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/banners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                resetForm();
                await fetchBanners();
            } else {
                const errorText = await res.text();
                let message = 'Failed to add banner';
                try {
                    const data = JSON.parse(errorText);
                    message = data.message || message;
                } catch {
                    message = `Server Error: ${errorText.substring(0, 100)}`;
                }
                alert(message);
            }
        } catch (error) {
            alert(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner? This cannot be undone.')) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/banners/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setBanners(prev => prev.filter(b => b._id !== id));
        } catch (error) {
            alert('Failed to delete banner');
        }
    };

    const toggleStatus = async (banner) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/banners/${banner._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                body: JSON.stringify({ isActive: !banner.isActive })
            });
            if (res.ok) {
                setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, isActive: !b.isActive } : b));
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const resetForm = () => {
        setForm({ image: '', title: '', link: '', isActive: true });
        setSelectedFile(null);
        setPreviewUrl('');
        setIsAddOpen(false);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Homepage Banners</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage the sliding promotional banners on the homepage.</p>
                </div>
                {!isAddOpen && (
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Banner
                    </button>
                )}
            </div>

            {/* Add Banner Form */}
            {isAddOpen && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900 text-lg">Add New Banner</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Image Upload Area */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wide">Banner Image (Required)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 relative group aspect-video flex flex-col items-center justify-center">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">Click or drag image here</p>
                                            <p className="text-xs text-gray-400 mt-1">Ideally 16:9 ratio (e.g. 1920x1080)</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Details Area */}
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Banner Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="e.g. 50% Off Summer Sale"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">Click Link (Optional)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.link}
                                            onChange={e => setForm({ ...form, link: e.target.value })}
                                            placeholder="e.g. /service/12345"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">Where users go when they click the banner</p>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <label className="text-sm font-medium text-gray-700">Set as Active Immediately?</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-60"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Upload & Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Banners List */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-10">
                    <Loader2 className="w-5 h-5 animate-spin" /> Fetching banners...
                </div>
            ) : banners.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm border-dashed">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No banners found</h3>
                    <p className="text-gray-500 mb-6">Upload your first promotional banner to display on the homepage.</p>
                    <button onClick={() => setIsAddOpen(true)} className="text-primary font-semibold hover:underline">
                        Upload Banner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map(banner => (
                        <div key={banner._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
                            <div className="relative aspect-video bg-gray-100">
                                <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button onClick={() => handleDelete(banner._id)} className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center backdrop-blur-sm transition">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {banner.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{banner.title || 'Untitled Banner'}</h3>
                                    {banner.link ? (
                                        <a href={banner.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 line-clamp-1">
                                            <LinkIcon className="w-3 h-3 flex-shrink-0" /> {banner.link}
                                        </a>
                                    ) : (
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3 flex-shrink-0" /> No link attached
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Visibility</span>
                                    <button
                                        onClick={() => toggleStatus(banner)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${banner.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${banner.isActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminBanners;
