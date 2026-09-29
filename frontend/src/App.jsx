import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import BackToTop from './components/BackToTop.jsx';
import PageLoader from './components/PageLoader.jsx';

import Home from './pages/Home.jsx';

// Everything except the landing page loads on demand, so the first visit is fast.
const Menu = lazy(() => import('./pages/Menu.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const Customizer = lazy(() => import('./pages/Customizer.jsx'));
const OrderTrack = lazy(() => import('./pages/OrderTrack.jsx'));
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children, adminOnly }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
    return null;
}

export default function App() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 1100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <PageLoader gone={loaded} />
            <ScrollToTop />
            <ScrollProgress />
            <Navbar />
            <main>
                <Suspense fallback={<div className="route-loading"><i className="fas fa-pizza-slice fa-spin"></i></div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/customizer" element={<Customizer />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track/:id" element={<OrderTrack />} />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </Suspense>
            </main>
            <Footer />
            <CartDrawer />
            <BackToTop />
        </>
    );
}
