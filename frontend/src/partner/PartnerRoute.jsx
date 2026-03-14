import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PartnerRoute = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // give auth context a tiny delay to load from local storage
        const timer = setTimeout(() => setLoading(false), 50);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return user && user.role === 'partner' ? children : <Navigate to="/login" replace />;
};

export default PartnerRoute;
