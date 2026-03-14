import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerRegister from './pages/PartnerRegister';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import AdminRoute from './admin/AdminRoute';
import AdminDashboard from './admin/AdminDashboard';
import AdminBookings from './admin/AdminBookings';
import AdminServices from './admin/AdminServices';
import AdminCategories from './admin/AdminCategories';
import AdminPartners from './admin/AdminPartners';
import AdminApplications from './admin/AdminApplications';
import AdminBanners from './admin/AdminBanners';
import AdminReviews from './admin/AdminReviews';
import AdminSupport from './admin/AdminSupport';
import AdminEmergencies from './admin/AdminEmergencies';
import AdminCustomers from './admin/AdminCustomers';
import PartnerRoute from './partner/PartnerRoute';
import PartnerDashboard from './partner/PartnerDashboard';
import PartnerOverview from './partner/PartnerOverview';
import PartnerSupport from './partner/PartnerSupport';
import PartnerEmergencies from './partner/PartnerEmergencies';

import GlobalFooterWrapper from './components/GlobalFooterWrapper';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/partner-register" element={<PartnerRegister />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/my-bookings" element={<MyBookings />} />

              {/* Admin Routes — protected */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
              <Route path="/admin/partners" element={<AdminRoute><AdminPartners /></AdminRoute>} />
              <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
              <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
              <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
              <Route path="/admin/emergencies" element={<AdminRoute><AdminEmergencies /></AdminRoute>} />
              <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />

              {/* Partner Routes — protected */}
              <Route path="/partner" element={<PartnerRoute><PartnerOverview /></PartnerRoute>} />
              <Route path="/partner/jobs" element={<PartnerRoute><PartnerDashboard /></PartnerRoute>} />
              <Route path="/partner/support" element={<PartnerRoute><PartnerSupport /></PartnerRoute>} />
              <Route path="/partner/emergencies" element={<PartnerRoute><PartnerEmergencies /></PartnerRoute>} />
            </Routes>
            <GlobalFooterWrapper />
          </Router>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;

