import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Loader2, X, Check, Upload, Link as LinkIcon, ImageIcon } from 'lucide-react';

const EMPTY_FORM = { title: '', category: '', price: '', description: '', image: '', duration: '', includes: '', excludes: '', benefits: '', allowedPincodes: '' };

const ImageInput = ({ value, onChange, token }) => {
    const [mode, setMode] = useState('url'); // 'url' | 'upload'
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const fileRef = useRef(null);

    // Reset error when value changes
    useEffect(() => { setImgError(false); }, [value]);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append('image', file);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: data
            });
            const json = await res.json();
            if (res.ok) {
                onChange(json.url);
            } else {
                alert(json.message || 'Upload failed');
            }
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally { setUploading(false); }
    };

    return (
        <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">
                Thumbnail Image <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-2">
                {[
                    { id: 'url', label: 'Paste URL', icon: <LinkIcon className="w-3.5 h-3.5" /> },
                    { id: 'upload', label: 'Upload File', icon: <Upload className="w-3.5 h-3.5" /> },
                ].map(m => (
                    <button key={m.id} type="button" onClick={() => setMode(m.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${mode === m.id ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 items-start">
                {/* Input area */}
                <div className="flex-1">
                    {mode === 'url' ? (
                        <div>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => { onChange(e.target.value); }}
                                placeholder="Paste a direct image URL (e.g. https://...jpg)"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            {value && imgError && (
                                <p className="text-xs text-amber-500 mt-1">⚠️ Image couldn't load — make sure it's a direct image link (ending in .jpg / .png / .webp)</p>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => !uploading && fileRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition text-sm text-gray-500"
                        >
                            {uploading ? (
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                    <span className="font-medium text-gray-600">Click to upload image</span>
                                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP, GIF · Max 5MB</p>
                                </>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    {value && !imgError ? (
                        <>
                            <img
                                src={value}
                                alt="thumbnail"
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                            <button
                                type="button"
                                onClick={() => { onChange(''); }}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminServices = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchAll = async () => {
        const [sRes, cRes] = await Promise.all([
            fetch('http://localhost:5000/api/services'),
            fetch('http://localhost:5000/api/categories')
        ]);
        setServices(await sRes.json());
        setCategories(await cRes.json());
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
    const openEdit = (s) => {
        // If same service is clicked again, close the inline form
        if (editing === s._id) {
            setEditing(null);
            setShowForm(false);
            return;
        }
        setEditing(s._id);
        setForm({
            title: s.title, category: s.category?._id || s.category,
            price: s.price, description: s.description, image: s.image || '',
            duration: s.duration || '',
            includes: (s.includes || []).join(', '),
            excludes: (s.excludes || []).join(', '),
            benefits: (s.benefits || []).join(', '),
            allowedPincodes: (s.allowedPincodes || []).join(', ')
        });
        setShowForm(false); // close the top "Add" form if open
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        const payload = {
            ...form,
            price: Number(form.price),
            includes: form.includes.split(',').map(s => s.trim()).filter(Boolean),
            excludes: form.excludes.split(',').map(s => s.trim()).filter(Boolean),
            benefits: form.benefits.split(',').map(s => s.trim()).filter(Boolean),
            allowedPincodes: (form.allowedPincodes || '').split(',').map(s => s.trim()).filter(Boolean),
        };
        const url = editing ? `http://localhost:5000/api/admin/services/${editing}` : `http://localhost:5000/api/admin/services`;
        const res = await fetch(url, {
            method: editing ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
            body: JSON.stringify(payload)
        });
        if (res.ok) { await fetchAll(); setShowForm(false); setEditing(null); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        await fetch(`http://localhost:5000/api/admin/services/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setServices(prev => prev.filter(s => s._id !== id));
        if (editing === id) { setEditing(null); }
    };

    const TEXT_FIELDS = [
        { name: 'title', label: 'Title', placeholder: 'e.g. AC Service & Repair' },
        { name: 'price', label: 'Price (₹)', placeholder: '499', type: 'number' },
        { name: 'duration', label: 'Duration', placeholder: '60 mins' },
        { name: 'description', label: 'Description', placeholder: 'Service description...', full: true },
        { name: 'includes', label: 'Includes (comma separated)', placeholder: 'Filter cleaning, Gas check', full: true },
        { name: 'excludes', label: 'Excludes (comma separated)', placeholder: 'Gas refill, Spare parts', full: true },
        { name: 'benefits', label: 'Benefits (comma separated)', placeholder: '30-day warranty, Verified pros', full: true },
        { name: 'allowedPincodes', label: 'Allowed Pincodes (comma separated, leave blank for all)', placeholder: 'e.g. 226010, 226011', full: true },
    ];

    // Reusable inline edit form component
    const EditFormPanel = ({ isInline = false }) => (
        <div className={`bg-white ${isInline ? 'border-x border-b border-primary/20 bg-primary/[0.02]' : 'rounded-2xl shadow-sm border border-gray-100 mb-6'} p-6`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-900">{editing ? '✏️ Edit Service' : '➕ Add New Service'}</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEXT_FIELDS.map(f => (
                    <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">{f.label}</label>
                        <input
                            type={f.type || 'text'}
                            name={f.name}
                            value={form[f.name]}
                            onChange={handleChange}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                ))}

                {/* Dual Image Input */}
                <ImageInput
                    value={form.image}
                    onChange={(val) => setForm(f => ({ ...f, image: val }))}
                    token={user?.token}
                />

                {/* Category */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block uppercase tracking-wide">Category</label>
                    <select name="category" value={form.category} onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-60 hover:bg-primary/90 transition">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editing ? 'Save Changes' : 'Add Service'}
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <button onClick={openAdd} className="bg-primary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition text-sm">
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            {/* Add New Service Form (only for "Add", appears at top) */}
            {showForm && !editing && <EditFormPanel />}

            {/* Services Table */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-10">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading services...
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Service', 'Category', 'Price', 'Duration', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {services.map(s => (
                                <React.Fragment key={s._id}>
                                    <tr className={`hover:bg-gray-50/50 ${editing === s._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {s.image
                                                    ? <img src={s.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                    : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-300" /></div>
                                                }
                                                <div>
                                                    <p className="font-semibold text-gray-900">{s.title}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{s.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{s.category?.name || '—'}</td>
                                        <td className="px-5 py-4 font-bold text-gray-900">₹{s.price}</td>
                                        <td className="px-5 py-4 text-gray-600">{s.duration || '—'}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(s)} className={`p-1.5 rounded-lg transition ${editing === s._id ? 'text-white bg-primary' : 'text-blue-500 hover:bg-blue-50'}`}>
                                                    {editing === s._id ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleDelete(s._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Inline Edit Form — appears right below this row */}
                                    {editing === s._id && (
                                        <tr>
                                            <td colSpan="5" className="p-0">
                                                <EditFormPanel isInline={true} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminServices;
