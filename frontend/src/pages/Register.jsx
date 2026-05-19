import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import PhoneInput from '../components/PhoneInput.jsx';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        try {
            const u = await register(form);
            toast.success(`Welcome, ${u.name}!`);
            navigate('/', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <section className="auth-page">
            <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div className="hero-orb orb-1" style={{ top: '-150px', right: '-100px' }}></div>
                <div className="hero-orb orb-2" style={{ bottom: '-100px', left: '-80px' }}></div>
            </div>
            <div className="auth-card">
                <h1>Create account</h1>
                <p className="sub">Join us — order faster and earn rewards.</p>
                <form className="auth-form" onSubmit={submit}>
                    <div className="form-field">
                        <label>Full Name</label>
                        <input name="name" value={form.name} onChange={onChange} placeholder="John Doe" required />
                    </div>
                    <div className="form-field">
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required autoComplete="email" />
                    </div>
                    <div className="form-field">
                        <label>Phone</label>
                        <PhoneInput name="phone" value={form.phone} onChange={onChange} />
                    </div>
                    <div className="form-field">
                        <label>Password</label>
                        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="At least 6 characters" minLength={6} required autoComplete="new-password" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading
                            ? <><i className="fas fa-spinner fa-spin"></i> Creating...</>
                            : <><i className="fas fa-user-plus"></i> Create Account</>
                        }
                    </button>
                </form>
                <p className="auth-foot">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </section>
    );
}
