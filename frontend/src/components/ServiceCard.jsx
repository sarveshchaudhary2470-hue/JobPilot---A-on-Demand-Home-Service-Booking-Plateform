import React from 'react';
import { Star, Clock, Heart, Shield, HelpCircle, FileText, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent navigating to service detail page
        addToCart(service);
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left relative h-full flex flex-col">

            <div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/service/${service._id}`)}>
                <img
                    src={service.image || "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Optional Rating Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 rounded font-bold text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    4.8
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 line-clamp-1">
                    {service.title}
                </h3>

                {/* Rating / Review count */}
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Star className="w-3 h-3 fill-primary text-primary mr-1" />
                    <span className="font-semibold text-gray-700 mr-1">4.8</span> (120 reviews)
                </div>

                <div className="text-sm font-bold text-gray-900 mb-3">
                    ₹{service.price}
                </div>

                <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">
                    {service.description}
                </p>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 rounded-lg transition-colors text-sm border border-primary/20"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
