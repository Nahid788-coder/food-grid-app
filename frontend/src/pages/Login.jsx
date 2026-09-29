import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const DEMO_EMAIL = 'demo@sliceandcrust.com';
const DEMO_PASSWORD = 'demo-view-only';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    const isStaff = (u) => u.role === 'admin' || u.role === 'demo';

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            const u = await login(form.email, form.password);
            toast.success(`Welcome back, ${u.name}!`);
            navigate(isStaff(u) ? '/admin' : from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    // Public read-only account so visitors can explore the admin dashboard.
    const tryDemo = async () => {
        try {
            const u = await login(DEMO_EMAIL, DEMO_PASSWORD);
            toast.success('Welcome to the read-only admin demo');
            navigate(isStaff(u) ? '/admin' : '/', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Demo login is not available right now');
        }
    };

    return (
        <section className="auth-page">
            <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div className="hero-orb orb-1" style={{ top: '-150px', left: '-100px' }}></div>
                <div className="hero-orb orb-2" style={{ bottom: '-100px', right: '-80px' }}></div>
            </div>
            <div className="auth-card">
                <h1>Welcome back</h1>
                <p className="sub">Sign in to your Slice &amp; Crust account.</p>
                <form className="auth-form" onSubmit={submit}>
                    <div className="form-field">
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required autoComplete="email" />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Your password" required autoComplete="current-password" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading
                            ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
                            : <><i className="fas fa-right-to-bracket"></i> Sign In</>
                        }
                    </button>
                </form>
                <p className="auth-foot">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
                <div className="demo-box">
                    <p><strong>Just exploring?</strong> See the admin dashboard with live charts and orders. It is read-only and customer details are hidden.</p>
                    <button type="button" className="btn btn-ghost btn-block" onClick={tryDemo} disabled={loading}>
                        <i className="fas fa-chart-line"></i> Try Admin Demo
                    </button>
                </div>
            </div>
        </section>
    );
}
