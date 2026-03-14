import React, { useState, useRef, useCallback } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let pos = ((clientX - rect.left) / rect.width) * 100;
        pos = Math.max(0, Math.min(100, pos));
        setSliderPosition(pos);
    }, []);

    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e) => { if (isDragging.current) handleMove(e.clientX); };
    const handleTouchMove = (e) => { handleMove(e.touches[0].clientX); };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[400px] aspect-[16/9] rounded-xl overflow-hidden cursor-col-resize select-none shadow-md border border-gray-200"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt="After Work"
                className="absolute inset-0 w-full h-full object-cover"
                draggable="false"
            />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before Work"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable="false"
                />
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 bg-red-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider pointer-events-none">
                Before
            </div>
            <div className="absolute top-3 right-3 bg-green-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider pointer-events-none">
                After
            </div>

            {/* Slider Line & Handle */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                {/* Drag Handle */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize border-2 border-gray-300 hover:scale-110 transition-transform"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L2 8L5 13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11 3L14 8L11 13" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
