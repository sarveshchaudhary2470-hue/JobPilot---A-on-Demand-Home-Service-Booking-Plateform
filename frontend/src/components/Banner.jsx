import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services/banners`);
                const data = await res.json();
                if (data && data.length > 0) {
                    setBanners(data);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };
        fetchBanners();
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 seconds

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextBanner = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    if (banners.length === 0) {
        // Fallback static banner if no banners found from backend
        return (
            <div className="max-w-6xl mx-auto px-6 mt-16 mb-20 text-center py-24 bg-gray-50 rounded-2xl border border-gray-100">
                <h2 className="text-xl font-bold text-gray-500">Welcome to JobPilot Home Services</h2>
                <p className="text-gray-400 mt-2">Professional services at your doorstep.</p>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    // Check if the link is external or internal
    const isExternalLink = currentBanner.link && (currentBanner.link.startsWith('http') || currentBanner.link.startsWith('//'));

    return (
        <div className="max-w-6xl mx-auto px-6 mt-16 mb-20">
            <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[300px] md:min-h-[400px] bg-slate-100 group">

                {/* Slides Container */}
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full absolute inset-0"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={banner._id} className="min-w-full relative h-[300px] md:h-[400px] flex-shrink-0">
                            <img
                                src={banner.image}
                                alt={banner.title || `Banner ${index + 1}`}
                                className="w-full h-full object-cover object-center relative z-0"
                            />

                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-14">
                                {banner.title && (
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                                        {banner.title}
                                    </h2>
                                )}
                                {banner.link && (
                                    <div className="mt-2">
                                        <a
                                            href={banner.link}
                                            target={banner.link.startsWith('http') || banner.link.startsWith('//') ? "_blank" : "_self"}
                                            rel={banner.link.startsWith('http') || banner.link.startsWith('//') ? "noreferrer" : ""}
                                            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                        >
                                            Book Now
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Controls (only show if multiple banners) */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={prevBanner}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextBanner}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Banner;
