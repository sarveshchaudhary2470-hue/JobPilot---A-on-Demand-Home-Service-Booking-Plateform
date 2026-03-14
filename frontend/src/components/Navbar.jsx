import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, LogOut, Menu, X, ChevronDown, User as UserIcon, Settings, Briefcase, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext'; // Added useLocation import

const Navbar = () => {
    const { user, logout } = useAuth();
    const { items } = useCart(); // Kept original items from useCart
    const navigate = useNavigate();
    const { pincode, updatePincode } = useLocation(); // Added pincode and updatePincode from useLocation

    const [placeholder, setPlaceholder] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state for mobile menu
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Added state for profile dropdown

    const profileRef = useRef(null); // Ref for profile dropdown
    const menuRef = useRef(null); // Ref for mobile menu

    // Typewriter effect strings
    const searchTerms = ['Electrician', 'Plumber', 'Cleaning', 'AC Repair', 'Pest Control', 'Salon'];

    useEffect(() => {
        let currentIndex = 0;
        let currentText = '';
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentWord = searchTerms[currentIndex];

            if (isDeleting) {
                currentText = currentWord.substring(0, currentText.length - 1);
                typingSpeed = 50;
            } else {
                currentText = currentWord.substring(0, currentText.length + 1);
                typingSpeed = 150;
            }

            setPlaceholder(`Search for '${currentText}'`);

            if (!isDeleting && currentText === currentWord) {
                isDeleting = true;
                typingSpeed = 1500;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % searchTerms.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        const timer = setTimeout(type, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Close dropdowns when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <nav className="bg-white px-6 py-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-50">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M12 2L2 12h3v8h14v-8h3L12 2zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold flex flex-col leading-tight">
                        <span className="text-gray-900">JobPilot</span>
                        <span className="text-[10px] text-gray-500 tracking-wider">HOME SERVICES</span>
                    </div>
                </Link>

                {/* Center Search Bar */}
                <div className="hidden md:flex flex-1 items-center max-w-4xl mx-4">

                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white relative shadow-sm">
                            <div className="flex items-center px-4 flex-1">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={placeholder || "What service do you need?"}
                                    className="bg-transparent border-none outline-none text-sm w-full py-2.5"
                                />
                            </div>
                            <button type="submit" className="bg-primary hover:bg-green-700 text-white px-6 font-medium text-sm transition-colors m-1 rounded-md">
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4">

                    <Link to="/cart" className="relative text-gray-700 hover:text-primary transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        // Logged-in state
                        <div className="flex items-center gap-3">
                            <Link to="/my-bookings" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold hidden md:block">{user.name?.split(' ')[0]}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        // Logged-out state
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
