import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="brand">
                        <span className="brand-icon">🍕</span>
                        <span className="brand-text">
                            Slice <span className="amp">&amp;</span> Crust
                        </span>
                    </Link>
                    <p>
                        Authentic wood-fired pizzas crafted with passion, served with love. Visit us
                        for an unforgettable taste experience.
                    </p>
                    <div className="footer-social">
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
                        <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div className="footer-col">
                    <h5>Quick Links</h5>
                    <Link to="/menu">Menu</Link>
                    <Link to="/about">Our Story</Link>
                    <Link to="/booking">Reservations</Link>
                    <Link to="/contact">Contact</Link>
                </div>
                <div className="footer-col">
                    <h5>Get In Touch</h5>
                    <a href="tel:+919876543210">
                        <i className="fas fa-phone"></i> +91 98765 43210
                    </a>
                    <a href="mailto:hello@sliceandcrust.com">
                        <i className="fas fa-envelope"></i> hello@sliceandcrust.com
                    </a>
                    <a href="#">
                        <i className="fas fa-location-dot"></i> Himatnagar, Gujarat
                    </a>
                </div>
                <div className="footer-col">
                    <h5>Hours</h5>
                    <p>Monday – Sunday<br />11:00 AM – 11:00 PM</p>
                    <p style={{ marginTop: 14, color: 'var(--primary)', fontWeight: 600 }}>
                        Friday Special:<br />Buy 1 Get 1 — 7-9 PM
                    </p>
                </div>
            </div>
            <div className="footer-bottom container">
                <p>
                    &copy; 2026 Slice &amp; Crust. All rights reserved. Crafted with{' '}
                    <i className="fas fa-heart" style={{ color: 'var(--primary)' }}></i>
                </p>
            </div>
        </footer>
    );
}
