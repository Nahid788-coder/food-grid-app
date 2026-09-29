import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Reveal from '../components/Reveal.jsx';
import PhoneInput from '../components/PhoneInput.jsx';

export default function Booking() {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', date: '', time: '', guests: 2, note: '',
    });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/bookings', form);
            toast.success('Booking confirmed! We\'ll see you soon.');
            setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, note: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="page-title-bar">
                <div className="container">
                    <h1>Reserve your <em style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Table</em></h1>
                    <p>Skip the wait — book in advance for the best experience.</p>
                </div>
            </header>

            <section className="section booking-section">
                <div className="container booking-grid">
                    <Reveal className="booking-text">
                        <span className="section-tag">Reserve</span>
                        <h2 className="section-title">Book your <em>table</em></h2>
                        <p>
                            Whether it's a quiet date, a family gathering, or a celebration — we'll save
                            you the perfect spot. Bookings are free and instantly confirmed.
                        </p>
                        <div className="booking-info">
                            <div><i className="fas fa-clock"></i> Open: 11 AM - 11 PM (Daily)</div>
                            <div><i className="fas fa-phone"></i> +91 98765 43210</div>
                            <div><i className="fas fa-location-dot"></i> 12 Crust Avenue, Himatnagar</div>
                            <div><i className="fas fa-people-roof"></i> Up to 30 guests for parties</div>
                        </div>
                    </Reveal>

                    <Reveal className="booking-form">
                        <form onSubmit={submit}>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Full Name *</label>
                                    <input name="name" value={form.name} onChange={onChange} placeholder="John Doe" required />
                                </div>
                                <div className="form-field">
                                    <label>Phone *</label>
                                    <PhoneInput name="phone" value={form.phone} onChange={onChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Email</label>
                                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
                                </div>
                            </div>
                            <div className="form-row three">
                                <div className="form-field">
                                    <label>Date *</label>
                                    <input name="date" type="date" value={form.date} onChange={onChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Time *</label>
                                    <input name="time" type="time" value={form.time} onChange={onChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Guests *</label>
                                    <select name="guests" value={form.guests} onChange={onChange} required>
                                        <option value="2">2 Guests</option>
                                        <option value="3">3 Guests</option>
                                        <option value="4">4 Guests</option>
                                        <option value="6">6 Guests</option>
                                        <option value="8">8 Guests</option>
                                        <option value="10">10+ Guests</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-field" style={{ marginBottom: 18 }}>
                                <label>Special Request</label>
                                <textarea name="note" value={form.note} onChange={onChange} placeholder="Window seat, allergies, occasions..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading
                                    ? <><i className="fas fa-spinner fa-spin"></i> Confirming...</>
                                    : <><i className="far fa-calendar-check"></i> Confirm Booking</>
                                }
                            </button>
                        </form>
                    </Reveal>
                </div>
            </section>
        </>
    );
}
