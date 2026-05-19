import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';
import Reveal from '../components/Reveal.jsx';

const SIZES = [
    { id: 'small', label: 'Small', diam: '8"', price: 199, scale: 0.7 },
    { id: 'medium', label: 'Medium', diam: '12"', price: 349, scale: 0.85, popular: true },
    { id: 'large', label: 'Large', diam: '16"', price: 499, scale: 1 },
];

const CRUSTS = [
    { id: 'thin', label: 'Thin & Crispy', extra: 0 },
    { id: 'classic', label: 'Classic Hand-Tossed', extra: 0 },
    { id: 'cheese-burst', label: 'Cheese Burst', extra: 80 },
    { id: 'whole-wheat', label: 'Whole Wheat', extra: 30 },
];

const SAUCES = [
    { id: 'tomato', label: 'Classic Tomato', color: '#c0392b' },
    { id: 'pesto', label: 'Basil Pesto', color: '#27ae60' },
    { id: 'bbq', label: 'Smoky BBQ', color: '#7f4f24' },
    { id: 'white', label: 'White (Cream)', color: '#f5e6c8' },
];

const CHEESE = [
    { id: 'mozzarella', label: 'Mozzarella', extra: 0 },
    { id: 'cheddar', label: 'Cheddar', extra: 30 },
    { id: 'four-cheese', label: 'Four-Cheese Blend', extra: 60 },
    { id: 'vegan', label: 'Vegan Cheese', extra: 80 },
];

const TOPPINGS = [
    { id: 'pepperoni', label: 'Pepperoni', emoji: '🍖', price: 60, veg: false },
    { id: 'chicken', label: 'Grilled Chicken', emoji: '🍗', price: 70, veg: false },
    { id: 'sausage', label: 'Italian Sausage', emoji: '🌭', price: 60, veg: false },
    { id: 'bacon', label: 'Crispy Bacon', emoji: '🥓', price: 70, veg: false },
    { id: 'mushroom', label: 'Mushrooms', emoji: '🍄', price: 40, veg: true },
    { id: 'onion', label: 'Red Onion', emoji: '🧅', price: 30, veg: true },
    { id: 'pepper', label: 'Bell Peppers', emoji: '🫑', price: 35, veg: true },
    { id: 'olives', label: 'Black Olives', emoji: '🫒', price: 45, veg: true },
    { id: 'tomato', label: 'Cherry Tomato', emoji: '🍅', price: 35, veg: true },
    { id: 'jalapeno', label: 'Jalapeños', emoji: '🌶️', price: 40, veg: true },
    { id: 'paneer', label: 'Tandoori Paneer', emoji: '🧀', price: 60, veg: true },
    { id: 'corn', label: 'Sweet Corn', emoji: '🌽', price: 30, veg: true },
];

export default function Customizer() {
    const [size, setSize] = useState(SIZES[1]);
    const [crust, setCrust] = useState(CRUSTS[1]);
    const [sauce, setSauce] = useState(SAUCES[0]);
    const [cheese, setCheese] = useState(CHEESE[0]);
    const [toppings, setToppings] = useState([]);
    const { addItem } = useCart();

    const toggleTopping = (t) => {
        setToppings((prev) =>
            prev.find((p) => p.id === t.id)
                ? prev.filter((p) => p.id !== t.id)
                : [...prev, t]
        );
    };

    const totalPrice = useMemo(() => {
        return (
            size.price +
            crust.extra +
            cheese.extra +
            toppings.reduce((s, t) => s + t.price, 0)
        );
    }, [size, crust, cheese, toppings]);

    const isVeg = useMemo(() => toppings.every((t) => t.veg), [toppings]);

    const addToCart = () => {
        const description =
            `${size.label} • ${crust.label} • ${sauce.label} • ${cheese.label}` +
            (toppings.length ? ` • ${toppings.map((t) => t.label).join(', ')}` : '');

        addItem({
            _id: `custom-${Date.now()}`,
            name: 'Build Your Own Pizza',
            description,
            price: totalPrice,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=85&auto=format&fit=crop',
            isVeg,
            category: 'custom',
        });
        toast.success('Custom pizza added to cart!');
    };

    return (
        <>
            <header className="page-title-bar">
                <div className="container">
                    <h1>Build Your <em style={{ background: 'linear-gradient(135deg, #ff6b35, #ffb627)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Pizza</em></h1>
                    <p>Pick your size, crust, sauce, cheese & toppings — exactly how you like it.</p>
                </div>
            </header>

            <section className="section" style={{ paddingTop: 60 }}>
                <div className="container">
                    <div className="customizer-grid">
                        {/* Pizza Preview */}
                        <Reveal>
                            <div className="pizza-preview">
                                <motion.div
                                    className="pizza-wrap"
                                    animate={{ scale: size.scale, rotate: [0, 360] }}
                                    transition={{ scale: { duration: 0.5 }, rotate: { duration: 60, repeat: Infinity, ease: 'linear' } }}
                                >
                                    <div className="pizza-base" style={{ background: sauce.color }}>
                                        <div className="pizza-cheese"></div>
                                        <AnimatePresence>
                                            {toppings.map((t, idx) => {
                                                const positions = [
                                                    { top: '20%', left: '30%' }, { top: '25%', left: '65%' },
                                                    { top: '50%', left: '20%' }, { top: '45%', left: '50%' },
                                                    { top: '55%', left: '70%' }, { top: '70%', left: '35%' },
                                                    { top: '70%', left: '60%' }, { top: '30%', left: '50%' },
                                                    { top: '60%', left: '50%' }, { top: '40%', left: '35%' },
                                                    { top: '40%', left: '70%' }, { top: '15%', left: '50%' },
                                                ];
                                                return (
                                                    <motion.div
                                                        key={t.id}
                                                        className="topping-emoji"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        style={positions[idx % positions.length]}
                                                    >
                                                        {t.emoji}
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                                <div className="preview-summary">
                                    <h3>{size.label} • {size.diam}</h3>
                                    <p>{crust.label} • {sauce.label} • {cheese.label}</p>
                                    {toppings.length > 0 && (
                                        <p style={{ marginTop: 6 }}>
                                            {toppings.map((t) => t.emoji).join(' ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Reveal>

                        {/* Options */}
                        <div className="customizer-options">
                            <div className="opt-block">
                                <h4>1. Choose Size</h4>
                                <div className="opt-row">
                                    {SIZES.map((s) => (
                                        <button
                                            key={s.id}
                                            className={`opt ${size.id === s.id ? 'active' : ''}`}
                                            onClick={() => setSize(s)}
                                        >
                                            <strong>{s.label}</strong>
                                            <span>{s.diam} • ₹{s.price}</span>
                                            {s.popular && <span className="opt-badge">Popular</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="opt-block">
                                <h4>2. Crust Type</h4>
                                <div className="opt-row">
                                    {CRUSTS.map((c) => (
                                        <button
                                            key={c.id}
                                            className={`opt ${crust.id === c.id ? 'active' : ''}`}
                                            onClick={() => setCrust(c)}
                                        >
                                            <strong>{c.label}</strong>
                                            <span>{c.extra > 0 ? `+₹${c.extra}` : 'Included'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="opt-block">
                                <h4>3. Sauce</h4>
                                <div className="opt-row">
                                    {SAUCES.map((s) => (
                                        <button
                                            key={s.id}
                                            className={`opt ${sauce.id === s.id ? 'active' : ''}`}
                                            onClick={() => setSauce(s)}
                                        >
                                            <span className="sauce-dot" style={{ background: s.color }}></span>
                                            <strong>{s.label}</strong>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="opt-block">
                                <h4>4. Cheese</h4>
                                <div className="opt-row">
                                    {CHEESE.map((c) => (
                                        <button
                                            key={c.id}
                                            className={`opt ${cheese.id === c.id ? 'active' : ''}`}
                                            onClick={() => setCheese(c)}
                                        >
                                            <strong>{c.label}</strong>
                                            <span>{c.extra > 0 ? `+₹${c.extra}` : 'Included'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="opt-block">
                                <h4>5. Toppings <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 400 }}>({toppings.length} selected)</span></h4>
                                <div className="topping-grid">
                                    {TOPPINGS.map((t) => {
                                        const sel = toppings.find((p) => p.id === t.id);
                                        return (
                                            <button
                                                key={t.id}
                                                className={`top-opt ${sel ? 'active' : ''}`}
                                                onClick={() => toggleTopping(t)}
                                            >
                                                <span className="top-emoji">{t.emoji}</span>
                                                <span className="top-label">{t.label}</span>
                                                <span className="top-price">+₹{t.price}</span>
                                                {!t.veg && <span className="non-veg-dot"></span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="custom-summary">
                                <div>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total</span>
                                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: 'var(--primary)' }}>
                                        ₹{totalPrice}
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={addToCart}>
                                    <i className="fas fa-cart-plus"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
