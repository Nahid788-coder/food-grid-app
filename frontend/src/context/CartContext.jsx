import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch { return []; }
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item) => {
        setItems((prev) => {
            const found = prev.find((i) => i._id === item._id);
            if (found) {
                return prev.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setOpen(true);
    };

    const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));

    const updateQty = (id, delta) =>
        setItems((prev) =>
            prev
                .map((i) => (i._id === id ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );

    const clear = () => setItems([]);

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQty, clear, subtotal, count, open, setOpen }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
