import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';

const ServiceSection = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [catRes, srRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`),
                    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`)
                ]);

                const catData = await catRes.json();
                const srvData = await srRes.json();

                setCategories(catData);
                setServices(srvData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return null; // Let CategoryList handle initial loading skeleton
    }

    // Create an array of categories that actually have services assigned to them
    const categoryWithServices = categories.filter(cat =>
        services.some(srv => srv.category && srv.category._id === cat._id)
    );

    return (
        <div className="max-w-6xl mx-auto px-6 mb-16">
            <div className="space-y-12">
                {categoryWithServices.map(category => {
                    // Get all services that belong to this category
                    const categoryServices = services.filter(
                        srv => srv.category && srv.category._id === category._id
                    );

                    return (
                        <div key={category._id} className="pt-4">
                            <div className="flex items-center gap-3 mb-6">
                                {/* Heading Icon & Title */}
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {category.name}
                                </h2>
                            </div>

                            <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar snap-x snap-mandatory">
                                {categoryServices.map(service => (
                                    <div key={service._id} className="min-w-[280px] max-w-[280px] sm:min-w-[300px] sm:max-w-[300px] snap-start flex-shrink-0">
                                        <ServiceCard service={service} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceSection;
