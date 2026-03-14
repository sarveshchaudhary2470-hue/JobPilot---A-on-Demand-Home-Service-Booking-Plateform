import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Using the full URL here for local dev API
                const res = await fetch('http://localhost:5000/api/categories');
                const data = await res.json();
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20 flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full text-center text-gray-500 font-medium">
                    Loading Categories...
                </div>
            </div>
        );
    }

    const handleCategoryClick = (categoryName) => {
        navigate(`/services?category=${encodeURIComponent(categoryName)}`);
    };

    const displayedCategories = showAll ? categories : categories.slice(0, 16);
    const hasMore = categories.length > 16;

    return (
        <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-6 justify-items-center mb-4">
                    {displayedCategories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => handleCategoryClick(category.name)}
                            className="flex flex-col items-center gap-3 cursor-pointer group w-full"
                        >
                            <div className={`w-14 h-14 ${category.bg} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white`}>
                                <span className={category.color}>{category.icon}</span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center uppercase tracking-wider group-hover:text-primary transition-colors">
                                {category.name.split(' ').map((word, i) => (
                                    <React.Fragment key={i}>
                                        {word}<br />
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                    ))}
                </div>
                {hasMore && (
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
                        >
                            {showAll ? 'Show less' : 'See all'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryList;
