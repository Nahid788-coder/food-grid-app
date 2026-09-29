import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { socket } from '../api/socket';

const STEPS = [
    { id: 'placed', label: 'Placed', icon: 'fas fa-check-circle' },
    { id: 'preparing', label: 'Preparing', icon: 'fas fa-fire-flame-curved' },
    { id: 'out-for-delivery', label: 'Out for Delivery', icon: 'fas fa-motorcycle' },
    { id: 'delivered', label: 'Delivered', icon: 'fas fa-house-chimney' },
];

export default function OrderTrack() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const ctrl = new AbortController();
        api.get(`/orders/track/${id}`, { signal: ctrl.signal })
            .then((r) => { setOrder(r.data); setLoading(false); })
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return;
                setError(err.response?.data?.message || 'Order not found');
                setLoading(false);
            });
        return () => ctrl.abort();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const subscribe = () => socket.emit('subscribe-order', id);
        socket.on('connect', subscribe); // rejoin after reconnects
        if (socket.connected) subscribe();
        else socket.connect();
        const onUpdate = (data) => {
            if (data.orderId === id) {
                setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
            }
        };
        socket.on('order-status-update', onUpdate);
        return () => {
            socket.off('connect', subscribe);
            socket.off('order-status-update', onUpdate);
        };
    }, [id]);

    if (loading) return (
        <div className="checkout-page">
            <div className="container" style={{ textAlign: 'center', padding: 60 }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: 'var(--primary)' }}></i>
            </div>
        </div>
    );

    if (error) return (
        <div className="checkout-page">
            <div className="container" style={{ textAlign: 'center', padding: 60 }}>
                <i className="fas fa-circle-exclamation" style={{ fontSize: 48, color: 'var(--danger)', marginBottom: 16 }}></i>
                <h2>{error}</h2>
            </div>
        </div>
    );

    const currentStepIdx = STEPS.findIndex((s) => s.id === order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <section className="checkout-page">
            <div className="container" style={{ maxWidth: 920 }}>
                <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 36 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26, flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Order ID</div>
                            <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 700 }}>
                                #{order._id.slice(-8).toUpperCase()}
                            </h2>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                                Placed {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div className={`status-pill status-${order.status}`} style={{ fontSize: 14, padding: '6px 16px' }}>
                            {order.status.replace(/-/g, ' ')}
                        </div>
                    </div>

                    {!isCancelled ? (
                        <div className="track-steps">
                            {STEPS.map((s, i) => {
                                const done = i <= currentStepIdx;
                                const active = i === currentStepIdx;
                                return (
                                    <div key={s.id} className={`track-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                                        <div className="track-circle">
                                            <i className={s.icon}></i>
                                        </div>
                                        <div className="track-label">{s.label}</div>
                                        {i < STEPS.length - 1 && <div className="track-line"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(var(--danger-rgb), 0.1)', border: '1px solid rgba(var(--danger-rgb), 0.3)', color: 'var(--danger)', padding: 16, borderRadius: 'var(--radius)', textAlign: 'center' }}>
                            <i className="fas fa-circle-xmark" style={{ marginRight: 8 }}></i>
                            This order was cancelled.
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 36, padding: 22, background: 'var(--bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
                    >
                        <h3 style={{ fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-body)' }}>Items</h3>
                        {order.items.map((it, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i === order.items.length - 1 ? 'none' : '1px solid var(--border)' }}>
                                <img src={it.image} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15 }}>{it.name}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {it.quantity}</div>
                                </div>
                                <strong>₹{it.price * it.quantity}</strong>
                            </div>
                        ))}
                        <div style={{ marginTop: 18, padding: '14px 0 0', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{order.total}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Delivery to</div>
                            <div style={{ fontSize: 15 }}>{order.address}</div>
                        </div>
                        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Payment</div>
                            <div style={{ fontSize: 15, textTransform: 'uppercase' }}>{order.paymentMethod} • <span style={{ color: order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--accent)' }}>{order.paymentStatus}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
