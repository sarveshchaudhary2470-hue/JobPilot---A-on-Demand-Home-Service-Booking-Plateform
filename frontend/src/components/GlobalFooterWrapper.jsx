import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

/**
 * GlobalFooterWrapper ensures the Footer is only displayed on Customer pages.
 * It hides the footer on '/admin', '/partner', and related sub-dashboard routes.
 */
const GlobalFooterWrapper = () => {
    const location = useLocation();

    // Check if the current path starts with /admin or /partner
    const hideFooter = location.pathname.startsWith('/admin') || location.pathname.startsWith('/partner');

    if (hideFooter) {
        return null;
    }

    return <Footer />;
};

export default GlobalFooterWrapper;
