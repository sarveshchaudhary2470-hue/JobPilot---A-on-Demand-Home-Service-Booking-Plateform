import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [pincode, setPincode] = useState('');

    useEffect(() => {
        const savedPincode = localStorage.getItem('userPincode');
        if (savedPincode) {
            setPincode(savedPincode);
        }
    }, []);

    const updatePincode = (newPincode) => {
        setPincode(newPincode);
        if (newPincode) {
            localStorage.setItem('userPincode', newPincode);
        } else {
            localStorage.removeItem('userPincode');
        }
    };

    return (
        <LocationContext.Provider value={{ pincode, updatePincode }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
