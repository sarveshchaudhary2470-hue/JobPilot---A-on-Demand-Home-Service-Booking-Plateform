import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, Trash2, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';

const AdminReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/reviews', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews');
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this review? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete review');
            }
            // Remove from UI
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" /> {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Platform Reviews
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor and moderate customer reviews across all services.</p>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white border text-center p-12 rounded-2xl shadow-sm">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No reviews found in the system yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/80 border-b text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Customer</th>
                                    <th className="p-4 font-semibold">Service</th>
                                    <th className="p-4 font-semibold">Rating</th>
                                    <th className="p-4 font-semibold w-1/3">Comment</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reviews.map(review => (
                                    <tr key={review._id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                    {review.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-900">{review.user?.name || 'Unknown User'}</p>
                                                    <p className="text-xs text-gray-500">{review.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-gray-900">{review.service?.title || 'Unknown Service'}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded w-fit">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                {review.rating}.0
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-600 line-clamp-2" title={review.comment}>{review.comment}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('en-IN')}
                                            </p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                disabled={deletingId === review._id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                title="Delete Review Permanently"
                                            >
                                                {deletingId === review._id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
