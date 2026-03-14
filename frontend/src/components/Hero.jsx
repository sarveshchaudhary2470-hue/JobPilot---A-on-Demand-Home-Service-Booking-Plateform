import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Hero = () => {
    const [placeholder, setPlaceholder] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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
                typingSpeed = 50; // Faster deleting
            } else {
                currentText = currentWord.substring(0, currentText.length + 1);
                typingSpeed = 150; // Normal typing
            }

            setPlaceholder(`Search for '${currentText}'`);

            if (!isDeleting && currentText === currentWord) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at end of word
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % searchTerms.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(type, typingSpeed);
        };

        const timer = setTimeout(type, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-20 pb-28 px-4 text-center bg-white relative overflow-hidden">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#111827] mb-6 tracking-tight leading-[1.1]">
                Home services at your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#059669] relative inline-block mt-2 pb-2">
                    fingertips
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-200/60" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0 10 Q 50 20 100 10" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                </span>
            </h1>

            <p className="text-gray-500 max-w-2xl mx-auto mt-4 mb-12 text-lg md:text-xl font-medium">
                Book professional services for your home. From cleaning and painting to salon and repairs.
            </p>

            {/* Hero Search Bar */}
            <form
                onSubmit={handleSearch}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50 flex items-center p-2.5 relative z-10 transition-transform duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:-translate-y-0.5"
            >
                <div className="pl-4 pr-2 text-gray-400">
                    <Search className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder || "What service do you need?"}
                    className="flex-1 px-3 py-3.5 bg-transparent border-none outline-none text-gray-800 w-full text-lg placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-colors text-lg"
                >
                    Search
                </button>
            </form>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-50 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[100px] opacity-60"></div>
            </div>
        </div>
    );
};

export default Hero;
