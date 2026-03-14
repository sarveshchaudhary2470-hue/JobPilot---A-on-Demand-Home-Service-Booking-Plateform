import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Cart = () => {
    const { items, removeFromCart, totalAmount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                    <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add services from our homepage to book them.</p>
                    <Link to="/" className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition">
                        Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart ({items.length})</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Items List */}
                    <div className="lg:w-2/3 space-y-4">
                        {items.map(service => (
                            <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <p className="text-xs text-primary font-semibold mb-0.5">{service.category?.name}</p>
                                    <h3 className="font-bold text-gray-900">{service.title}</h3>
                                    <p className="text-sm text-gray-500">{service.duration}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="font-bold text-xl text-gray-900">₹{service.price}</p>
                                    <button
                                        onClick={() => removeFromCart(service._id)}
                                        className="text-red-400 hover:text-red-600 transition"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                {items.map(s => (
                                    <div key={s._id} className="flex justify-between text-sm text-gray-600">
                                        <span className="truncate max-w-[160px]">{s.title}</span>
                                        <span className="font-medium text-gray-900">₹{s.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-lg mb-6">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <ArrowRight className="w-5 h-5" />
                            </button>
                            {!user && (
                                <p className="text-xs text-center text-gray-400 mt-3">You'll need to login to checkout.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
