import { useEffect, useState } from 'react';
import api from '../api/axios';
import Reveal from '../components/Reveal.jsx';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ctrl = new AbortController();
        api.get('/orders/my', { signal: ctrl.signal })
            .then((r) => { setOrders(r.data); setLoading(false); })
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return;
                setLoading(false);
            });
        return () => ctrl.abort();
    }, []);

    return (
        <section className="checkout-page">
            <div className="container">
                <Reveal>
                    <h1 style={{ fontSize: 36, marginBottom: 8 }}>My Orders</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Track and review your past orders.</p>
                </Reveal>

                {loading
                    ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}><i className="fas fa-spinner fa-spin" style={{ fontSize: 28 }}></i></p>
                    : orders.length === 0
                        ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                            <i className="fas fa-receipt" style={{ fontSize: 48, color: 'var(--text-dim)', marginBottom: 16 }}></i>
                            <p style={{ fontSize: 18, fontWeight: 600 }}>No orders yet</p>
                            <span style={{ fontSize: 15 }}>Place your first order to see it here.</span>
                        </div>
                        : <div style={{ display: 'grid', gap: 16 }}>
                            {orders.map((o) => (
                                <div key={o._id} style={{
                                    background: 'var(--bg-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 22,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                                        <div>
                                            <strong style={{ fontSize: 15 }}>Order #{o._id.slice(-6).toUpperCase()}</strong>
                                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                                {new Date(o.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <span className={`status-pill status-${o.status}`}>{o.status.replace(/-/g, ' ')}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                                        {o.items.map((it, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', padding: '6px 12px', borderRadius: 100, fontSize: 14 }}>
                                                <img src={it.image} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                                                {it.name} ×{it.quantity}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{o.items.length} {o.items.length === 1 ? 'item' : 'items'}</span>
                                        <strong style={{ fontSize: 18, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{o.total}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>
        </section>
    );
}
