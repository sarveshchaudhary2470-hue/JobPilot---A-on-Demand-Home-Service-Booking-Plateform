import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import { Search } from 'lucide-react';

const Services = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const categoryQuery = searchParams.get('category');

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`);
                const data = await res.json();

                let filtered = data;

                // 2. Filter by Search Query
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    filtered = filtered.filter(srv => {
                        const titleMatch = srv.title?.toLowerCase().includes(lowerQuery);
                        const descMatch = srv.description?.toLowerCase().includes(lowerQuery);
                        const catMatch = srv.category?.name?.toLowerCase().includes(lowerQuery);
                        return titleMatch || descMatch || catMatch;
                    });
                } else if (categoryQuery) {
                    const lowerCat = categoryQuery.toLowerCase();
                    filtered = filtered.filter(srv =>
                        srv.category && srv.category.name.toLowerCase().includes(lowerCat)
                    );
                }

                setServices(filtered);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };

        fetchServices();
    }, [query, categoryQuery]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {query ? `Search results for "${query}"` : categoryQuery ? `${categoryQuery} Services` : 'All Services'}
                        </h1>
                        <p className="text-gray-500 mt-1">Found {services.length} result(s)</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {services.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No services found</h2>
                        <p className="text-gray-500">Try adjusting your search or selecting a different category.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Services;
