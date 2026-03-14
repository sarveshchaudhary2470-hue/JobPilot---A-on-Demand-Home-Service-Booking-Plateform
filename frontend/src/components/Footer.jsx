import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Company Info */}
                <div className="space-y-4">
                    <Link to="/" className="flex items-center gap-2 text-white">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <Home className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold tracking-tight">JobPilot</span>
                            <span className="block text-[10px] text-primary font-medium tracking-widest mt-[-4px]">HOME SERVICES</span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed mt-4 text-gray-400">
                        Your trusted partner for all home service needs. We connect you with verified, professional experts to make your life easier and your home better.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> All Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/my-bookings" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> My Bookings
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/partner-register" className="text-primary font-semibold text-sm hover:text-white transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Join as Partner
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Top Categories */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-6">Top Categories</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/services?category=AC%20%26%20Appliance" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> AC & Appliance
                            </Link>
                        </li>
                        <li>
                            <Link to="/services?category=Cleaning" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Cleaning Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/services?category=Plumber" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Professional Plumbing
                            </Link>
                        </li>
                        <li>
                            <Link to="/services?category=Electrician" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                                <ArrowRight className="w-3 h-3" /> Expert Electricians
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-400">R.R. Institute of Modern Technology, Lucknow</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm text-gray-400">+91 98765 43210</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm text-gray-400">support@jobpilot.com</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} JobPilot Home Services. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
