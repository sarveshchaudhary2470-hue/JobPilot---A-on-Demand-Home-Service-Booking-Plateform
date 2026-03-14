import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addToCart = (service) => {
        setItems(prev => {
            const exists = prev.find(i => i._id === service._id);
            if (exists) return prev; // already in cart
            return [...prev, service];
        });
    };

    const removeFromCart = (serviceId) => {
        setItems(prev => prev.filter(i => i._id !== serviceId));
    };

    const clearCart = () => setItems([]);

    const isInCart = (serviceId) => items.some(i => i._id === serviceId);

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
