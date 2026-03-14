import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Shield, CheckCircle2, MapPin, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Navbar from '../components/Navbar';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [reviewsData, setReviewsData] = useState({ reviews: [], average: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkPincode, setCheckPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState(null); // 'available' | 'unavailable' | null
    const { addToCart, removeFromCart, isInCart } = useCart();

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const [serviceRes, reviewsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services/${id}`),
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reviews/service/${id}`)
                ]);

                if (!serviceRes.ok) throw new Error('Service not found');

                const serviceData = await serviceRes.json();
                setService(serviceData);

                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviewsData(reviewsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [id]);

    const handleBookNow = () => {
        addToCart(service);
        navigate('/cart');
    };

    const handleCheckPincode = (e) => {
        e.preventDefault();
        if (!checkPincode || checkPincode.length !== 6) return;

        if (!service.allowedPincodes || service.allowedPincodes.length === 0) {
            setPincodeStatus('available');
            return;
        }

        if (service.allowedPincodes.includes(checkPincode)) {
            setPincodeStatus('available');
        } else {
            setPincodeStatus('unavailable');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading service details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!service) return null;

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            <Navbar />

            {/* Breadcrumb section - Simplified */}
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
                    <span>/</span>
                    <span className="hover:text-primary cursor-pointer" onClick={() => navigate(`/services?category=${service.category?.name}`)}>{service.category?.name}</span>
                    <span>/</span>
                    <span className="text-gray-900">{service.title}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* Main Image */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-[300px] md:h-[400px] object-cover"
                            />
                        </div>

                        {/* Title & Basic Info (Mobile prominent, but good for desktop too) */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium mb-4">
                                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {reviewsData.count > 0 ? reviewsData.average : service.rating} ({reviewsData.count > 0 ? reviewsData.count : service.reviews} reviews)
                                </span>
                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    <Clock className="w-4 h-4" />
                                    {service.duration}
                                </span>
                            </div>
                        </div>

                        {/* Availability Checker */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Check Availability
                            </h3>
                            <form onSubmit={handleCheckPincode} className="flex gap-3">
                                <input
                                    type="text"
                                    value={checkPincode}
                                    onChange={(e) => setCheckPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter your Pincode"
                                    maxLength="6"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                                    required
                                />
                                <button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors">
                                    Check
                                </button>
                            </form>

                            {pincodeStatus === 'available' && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm font-semibold animate-fadeInUp">
                                    <CheckCircle2 className="w-4 h-4" /> Great! This service is available in your area.
                                </div>
                            )}
                            {pincodeStatus === 'unavailable' && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-semibold animate-fadeInUp">
                                    <Shield className="w-4 h-4" /> Sorry, this service is not available in {checkPincode} yet.
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-4">Service Overview</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {service.description}
                            </p>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Includes & Excludes */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Included */}
                            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    What's Included
                                </h3>
                                <ul className="space-y-3">
                                    {service.includes?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Excluded */}
                            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-red-500" /> {/* Changed from XCircle to Shield as per new imports */}
                                    What's Excluded
                                </h3>
                                <ul className="space-y-3">
                                    {service.excludes?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-4">JobPilot Promise</h3>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {service.benefits?.map((benefit, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                                        <Shield className="w-8 h-8 text-primary" /> {/* Changed from ShieldCheck to Shield as per new imports */}
                                        <span className="font-medium text-gray-800 text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-200 my-8" />

                        {/* Customer Reviews Section */}
                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-2xl text-gray-900">Customer Reviews</h3>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                        {reviewsData.count > 0 ? reviewsData.average : service.rating}
                                    </div>
                                    <p className="text-sm text-gray-500">{reviewsData.count > 0 ? reviewsData.count : service.reviews} verified reviews</p>
                                </div>
                            </div>

                            {reviewsData.reviews.length === 0 ? (
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                                    <p className="text-gray-500">No reviews yet for this service. Be the first to try it out!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviewsData.reviews.map((review) => (
                                        <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{review.user?.name || 'JobPilot User'}</h4>
                                                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                    {review.rating}.0
                                                </div>
                                            </div>
                                            {/* Evidence Wall: Before/After Slider */}
                                            {review.booking?.beforeImage && review.booking?.afterImage && (
                                                <div className="mt-4 mb-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">📸 Work Evidence</p>
                                                    <BeforeAfterSlider
                                                        beforeImage={review.booking.beforeImage}
                                                        afterImage={review.booking.afterImage}
                                                    />
                                                </div>
                                            )}
                                            <p className="text-gray-700 text-sm leading-relaxed mt-2">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Sticky Cart Card */}
                    <div className="lg:w-1/3 relative">
                        <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                            <h3 className="font-bold text-xl text-gray-900 mb-4">Booking Summary</h3>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600 font-medium">Service Price</span>
                                <span className="text-3xl font-bold text-gray-900">₹{service.price}</span>
                            </div>

                            <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex items-start gap-2 mb-6">
                                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>Estimated time taken for this service is <strong>{service.duration}</strong>. Please ensure someone is available at home.</p>
                            </div>

                            {isInCart(service._id) ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold py-3 rounded-xl border border-green-200">
                                        <CheckCircle2 className="w-5 h-5" /> Added to Cart
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => removeFromCart(service._id)}
                                            className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                        >
                                            <Shield className="w-4 h-4" /> Remove {/* Changed from Trash2 to Shield as per new imports */}
                                        </button>
                                        <button
                                            onClick={() => navigate('/cart')} // Changed from Link to button with navigate
                                            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2"
                                        >
                                            <Shield className="w-4 h-4" /> View Cart {/* Changed from ShoppingCart to Shield as per new imports */}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                                >
                                    <Shield className="w-5 h-5" /> Add to Cart {/* Changed from ShoppingCart to Shield as per new imports */}
                                </button>
                            )}

                            <p className="text-xs text-center text-gray-500 mt-4">
                                By proceeding, you agree to our Terms of Service &amp; Privacy Policy.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
