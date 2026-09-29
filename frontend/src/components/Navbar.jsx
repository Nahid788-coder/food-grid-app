import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobOpen, setMobOpen] = useState(false);
    const { count, setOpen: setCartOpen } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { to: '/', label: 'Home', end: true },
        { to: '/menu', label: 'Menu' },
        { to: '/customizer', label: 'Build Your Own' },
        { to: '/about', label: 'About' },
        { to: '/booking', label: 'Booking' },
        { to: '/contact', label: 'Contact' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-inner">
                <Link to="/" className="brand">
                    <span className="brand-icon">🍕</span>
                    <span className="brand-text">
                        Slice <span className="amp">&amp;</span> Crust
                    </span>
                </Link>

                <ul className={`nav-menu ${mobOpen ? 'open' : ''}`}>
                    {links.map((l) => (
                        <li key={l.to}>
                            <NavLink
                                to={l.to}
                                end={l.end}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setMobOpen(false)}
                            >
                                {l.label}
                            </NavLink>
                        </li>
                    ))}
                    {(user?.role === 'admin' || user?.role === 'demo') && (
                        <li>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setMobOpen(false)}
                            >
                                Admin
                            </NavLink>
                        </li>
                    )}
                    {user ? (
                        <>
                            <li>
                                <NavLink
                                    to="/orders"
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobOpen(false)}
                                >
                                    My Orders
                                </NavLink>
                            </li>
                            <li>
                                <button className="nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setMobOpen(false)}
                            >
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>

                <div className="nav-actions">
                    <button
                        className="cart-btn"
                        onClick={() => setCartOpen(true)}
                        aria-label="Open cart"
                    >
                        <i className="fas fa-shopping-bag"></i>
                        <span className={`cart-count ${count === 0 ? 'hidden' : ''}`}>{count}</span>
                    </button>
                    <button
                        className="hamburger"
                        onClick={() => setMobOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
