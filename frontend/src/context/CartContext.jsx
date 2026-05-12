import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === product._id);
            if (existing) {
                return prev.map(i =>
                    i.productId === product._id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, {
                productId: product._id,
                title: product.title,
                price: product.discountedPrice || product.price,
                originalPrice: product.price,
                image: product.images?.[0]?.url || '',
                category: product.category,
                artistId: product.artistId,
                quantity,
                stock: product.stock || 99
            }];
        });
    };

    const removeItem = (productId) => {
        setItems(prev => prev.filter(i => i.productId !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return removeItem(productId);
        setItems(prev =>
            prev.map(i => i.productId === productId ? { ...i, quantity } : i)
        );
    };

    const clearCart = () => setItems([]);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            itemCount, subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
