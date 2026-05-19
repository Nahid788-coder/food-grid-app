import { useEffect, useState, useCallback } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { socket } from '../api/socket';
import MenuItemForm from '../components/MenuItemForm.jsx';

const STATUS_FLOW = {
    order: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    booking: ['pending', 'confirmed', 'completed', 'cancelled'],
};

const PIE_COLORS = ['#ff6b35', '#ffb627', '#43e97b', '#6c63ff', '#ff4757', '#9b59b6'];

export default function Admin() {
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [menu, setMenu] = useState([]);
    const [editingItem, setEditingItem] = useState(undefined);

    const refreshStats = useCallback(async () => {
        try {
            const { data } = await api.get('/stats');
            setStats(data);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        const ctrl = new AbortController();
        const opts = { signal: ctrl.signal };
        Promise.all([
            api.get('/stats', opts),
            api.get('/orders', opts),
            api.get('/bookings', opts),
            api.get('/menu', opts),
        ])
            .then(([s, o, b, m]) => {
                setStats(s.data);
                setOrders(o.data);
                setBookings(b.data);
                setMenu(m.data);
            })
            .catch((err) => {
                if (err.code === 'ERR_CANCELED') return;
                toast.error('Failed to load admin data');
            });
        return () => ctrl.abort();
    }, []);

    useEffect(() => {
        if (!socket.connected) socket.connect();
        socket.emit('admin-join');
        const onNew = (order) => {
            setOrders((prev) => [order, ...prev]);
            toast.success(`🔔 New order from ${order.customerName}`);
            refreshStats();
        };
        const onUpd = (order) => {
            setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
            refreshStats();
        };
        socket.on('new-order', onNew);
        socket.on('order-updated', onUpd);
        return () => {
            socket.off('new-order', onNew);
            socket.off('order-updated', onUpd);
        };
    }, [refreshStats]);

    const updateOrderStatus = async (id, status) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
            toast.success('Status updated');
            refreshStats();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            const { data } = await api.put(`/bookings/${id}/status`, { status });
            setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
            toast.success('Status updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const deleteMenuItem = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await api.delete(`/menu/${id}`);
            setMenu((prev) => prev.filter((m) => m._id !== id));
            toast.success('Deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const onItemSaved = (saved) => {
        setEditingItem(undefined);
        if (saved) {
            setMenu((prev) => {
                const idx = prev.findIndex((m) => m._id === saved._id);
                if (idx >= 0) {
                    const next = [...prev];
                    next[idx] = saved;
                    return next;
                }
                return [saved, ...prev];
            });
        }
    };

    const totals = stats?.totals || {};
    const statusPieData = Object.entries(stats?.statusCounts || {}).map(([name, value]) => ({ name, value }));

    return (
        <section className="admin-page">
            <div className="container">
                <h1 style={{ fontSize: 36, marginBottom: 8 }}>
                    Admin <em style={{ background: 'linear-gradient(135deg, #ff6b35, #ffb627)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>Dashboard</em>
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 8px var(--success)' }}></span>
                        Live • Real-time updates active
                    </span>
                </p>

                <div className="admin-tabs">
                    <button className={`admin-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
                        Overview
                    </button>
                    <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                        Orders ({orders.length})
                    </button>
                    <button className={`admin-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
                        Bookings ({bookings.length})
                    </button>
                    <button className={`admin-tab ${tab === 'menu' ? 'active' : ''}`} onClick={() => setTab('menu')}>
                        Menu ({menu.length})
                    </button>
                </div>

                {tab === 'overview' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
                            {[
                                { l: 'Total Revenue', v: `₹${(totals.revenue || 0).toLocaleString()}`, i: 'fas fa-indian-rupee-sign', c: '#43e97b' },
                                { l: 'Today\'s Revenue', v: `₹${(totals.todayRevenue || 0).toLocaleString()}`, i: 'fas fa-chart-line', c: '#ff6b35' },
                                { l: 'Today\'s Orders', v: totals.todayOrders ?? 0, i: 'fas fa-bag-shopping', c: '#ffb627' },
                                { l: 'Total Orders', v: totals.orders ?? 0, i: 'fas fa-receipt', c: '#6c63ff' },
                                { l: 'Bookings', v: totals.bookings ?? 0, i: 'far fa-calendar-check', c: '#9b59b6' },
                                { l: 'Menu Items', v: totals.menuItems ?? 0, i: 'fas fa-utensils', c: '#e74c3c' },
                            ].map((s, i) => (
                                <div key={i} className="stat-card" style={{
                                    background: 'var(--bg-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '22px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: `${s.c}22`, color: s.c,
                                        display: 'grid', placeItems: 'center', fontSize: 18,
                                    }}>
                                        <i className={s.i}></i>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700 }}>{s.v}</div>
                                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{s.l}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 18 }}>
                            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                                <h4 style={{ marginBottom: 14, fontFamily: 'Outfit, sans-serif', fontSize: 16 }}>Revenue — Last 7 Days</h4>
                                <ResponsiveContainer width="100%" height={260}>
                                    <LineChart data={stats?.weekly || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#9999a8" fontSize={12} />
                                        <YAxis stroke="#9999a8" fontSize={12} />
                                        <Tooltip contentStyle={{ background: '#14141d', border: '1px solid #1f1f2c', borderRadius: 8 }} />
                                        <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2.5} dot={{ fill: '#ff6b35', r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                                <h4 style={{ marginBottom: 14, fontFamily: 'Outfit, sans-serif', fontSize: 16 }}>Order Status</h4>
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                                            {statusPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#14141d', border: '1px solid #1f1f2c', borderRadius: 8 }} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                            <h4 style={{ marginBottom: 14, fontFamily: 'Outfit, sans-serif', fontSize: 16 }}>Top Selling Items</h4>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stats?.topItems || []} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" stroke="#9999a8" fontSize={12} />
                                    <YAxis type="category" dataKey="name" stroke="#9999a8" fontSize={12} width={140} />
                                    <Tooltip contentStyle={{ background: '#14141d', border: '1px solid #1f1f2c', borderRadius: 8 }} />
                                    <Bar dataKey="sold" fill="#ffb627" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {tab === 'orders' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</td></tr>}
                                {orders.map((o) => (
                                    <tr key={o._id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>#{o._id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div>{o.customerName}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                                        </td>
                                        <td style={{ fontSize: 13 }}>{o.items.length} items</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.total}</td>
                                        <td style={{ textTransform: 'uppercase', fontSize: 11.5, fontWeight: 600 }}>
                                            {o.paymentMethod}
                                            <div style={{ fontSize: 10, color: o.paymentStatus === 'paid' ? 'var(--success)' : 'var(--accent)' }}>{o.paymentStatus}</div>
                                        </td>
                                        <td>
                                            <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)} style={{ padding: '6px 10px', fontSize: 12.5, width: 'auto' }}>
                                                {STATUS_FLOW.order.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'bookings' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet</td></tr>}
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b.name}</td>
                                        <td>{b.phone}</td>
                                        <td>{new Date(b.date).toLocaleDateString()}</td>
                                        <td>{b.time}</td>
                                        <td>{b.guests}</td>
                                        <td>
                                            <select value={b.status} onChange={(e) => updateBookingStatus(b._id, e.target.value)} style={{ padding: '6px 10px', fontSize: 12.5, width: 'auto' }}>
                                                {STATUS_FLOW.booking.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'menu' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                            <button className="btn btn-primary" onClick={() => setEditingItem(null)}>
                                <i className="fas fa-plus"></i> Add Item
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Flags</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {menu.map((m) => (
                                        <tr key={m._id}>
                                            <td><img src={m.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} /></td>
                                            <td>{m.name}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{m.category}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{m.price}</td>
                                            <td>★ {m.rating?.toFixed(1) ?? '4.5'}</td>
                                            <td style={{ fontSize: 11.5 }}>
                                                {m.isVeg && <span style={{ color: 'var(--success)' }}>VEG </span>}
                                                {m.isSpicy && <span style={{ color: 'var(--danger)' }}>SPICY </span>}
                                                {m.isFeatured && <span style={{ color: 'var(--accent)' }}>★</span>}
                                            </td>
                                            <td>
                                                <button onClick={() => setEditingItem(m)} className="btn btn-sm" style={{ background: 'rgba(108,99,255,0.15)', color: '#6c63ff', marginRight: 6 }}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button onClick={() => deleteMenuItem(m._id)} className="btn btn-sm" style={{ background: 'rgba(255,71,87,0.15)', color: 'var(--danger)' }}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {editingItem !== undefined && (
                    <MenuItemForm
                        item={editingItem}
                        onSaved={onItemSaved}
                        onClose={() => setEditingItem(undefined)}
                    />
                )}
            </div>
        </section>
    );
}
