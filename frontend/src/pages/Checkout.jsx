import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Reveal from '../components/Reveal.jsx';
import PhoneInput from '../components/PhoneInput.jsx';

// The Razorpay public key never changes while the app is open, so it is asked for
// once and the same answer is reused (including when the customer clicks Pay).
let paymentKeyRequest = null;
function loadPaymentKey() {
    paymentKeyRequest ??= api
        .get('/payment/key')
        .then(({ data }) => data)
        .catch(() => {
            paymentKeyRequest = null; // try again next time
            return { configured: false, key: null };
        });
    return paymentKeyRequest;
}

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

export default function Checkout() {
    const { items, subtotal, clear } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        customerName: user?.name || '',
        customerPhone: user?.phone || '',
        customerEmail: user?.email || '',
        address: '',
        paymentMethod: 'cod',
        notes: '',
    });

    const deliveryFee = subtotal >= 599 ? 0 : 40;
    const tax = +(subtotal * 0.05).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    // Online payment is only offered when the server has Razorpay keys.
    const [onlineReady, setOnlineReady] = useState(null);
    useEffect(() => {
        let alive = true;
        loadPaymentKey().then((data) => alive && setOnlineReady(Boolean(data.configured)));
        return () => { alive = false; };
    }, []);

    const placeOrderInDB = async () => {
        // Only ids and quantities are sent; the server works out every price.
        const { data } = await api.post('/orders', {
            ...form,
            items: items.map((i) =>
                i.custom ? { custom: i.custom, quantity: i.quantity } : { item: i._id, quantity: i.quantity }
            ),
        });
        return data;
    };

    const handleRazorpay = async () => {
        const ok = await loadRazorpayScript();
        if (!ok) return toast.error('Razorpay SDK failed to load');

        const keyData = await loadPaymentKey();
        if (!keyData.configured) {
            toast.error('Online payment is not available right now. Please choose Cash on Delivery.');
            return null;
        }

        const order = await placeOrderInDB();
        let rzpOrder;
        try {
            ({ data: rzpOrder } = await api.post('/payment/create-order', { orderId: order._id }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not start payment');
            clear();
            navigate(`/track/${order._id}`);
            return null;
        }

        return new Promise((resolve) => {
            const options = {
                key: keyData.key,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: 'Slice & Crust',
                description: 'Order Payment',
                order_id: rzpOrder.orderId,
                prefill: {
                    name: form.customerName,
                    email: form.customerEmail,
                    contact: form.customerPhone,
                },
                theme: { color: '#C8452C' },
                handler: async (response) => {
                    try {
                        await api.post('/payment/verify', response);
                        toast.success('Payment successful! 🎉');
                        clear();
                        navigate(`/track/${order._id}`);
                        resolve(true);
                    } catch {
                        toast.error('Payment verification failed');
                        resolve(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast('Payment cancelled — order saved as pending');
                        clear();
                        navigate(`/track/${order._id}`);
                        resolve(false);
                    },
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        if (items.length === 0) return toast.error('Cart is empty');
        setLoading(true);
        try {
            if (form.paymentMethod !== 'cod') {
                await handleRazorpay();
            } else {
                const order = await placeOrderInDB();
                toast.success('Order placed! 🎉');
                clear();
                navigate(`/track/${order._id}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <section className="checkout-page">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="fas fa-shopping-bag" style={{ fontSize: 60, color: 'var(--text-dim)', marginBottom: 20 }}></i>
                    <h2 style={{ marginBottom: 10 }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Add something delicious before checking out.</p>
                    <Link to="/menu" className="btn btn-primary"><i className="fas fa-utensils"></i> Browse Menu</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout-page">
            <div className="container" style={{ maxWidth: 1200 }}>
                <Reveal>
                    <h1 style={{ fontSize: 36, marginBottom: 8 }}>Checkout</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>Almost there — just confirm your details.</p>
                </Reveal>

                <div className="checkout-grid">
                    <Reveal>
                        <form onSubmit={submit} className="booking-form" style={{ padding: 32 }}>
                            <h3 style={{ marginBottom: 18, fontFamily: 'var(--font-body)', fontSize: 18 }}>Delivery Details</h3>
                            <div className="form-row">
                                <div className="form-field">
                                    <label>Full Name *</label>
                                    <input name="customerName" value={form.customerName} onChange={onChange} required />
                                </div>
                                <div className="form-field">
                                    <label>Phone *</label>
                                    <PhoneInput name="customerPhone" value={form.customerPhone} onChange={onChange} required />
                                </div>
                            </div>
                            <div className="form-field" style={{ marginBottom: 14 }}>
                                <label>Email</label>
                                <input name="customerEmail" type="email" value={form.customerEmail} onChange={onChange} />
                            </div>
                            <div className="form-field" style={{ marginBottom: 14 }}>
                                <label>Delivery Address *</label>
                                <textarea name="address" value={form.address} onChange={onChange} placeholder="Street, area, landmark, city, pincode..." required />
                            </div>
                            <div className="form-field" style={{ marginBottom: 14 }}>
                                <label>Order Notes</label>
                                <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Less spicy, no onions, ring bell twice..." />
                            </div>

                            <h3 style={{ margin: '24px 0 14px', fontFamily: 'var(--font-body)', fontSize: 18 }}>Payment Method</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
                                {[
                                    { v: 'cod', l: 'Cash on Delivery', i: 'fas fa-money-bill-wave' },
                                    { v: 'upi', l: 'UPI', i: 'fas fa-mobile-screen' },
                                    { v: 'card', l: 'Credit / Debit Card', i: 'fas fa-credit-card' },
                                    { v: 'netbanking', l: 'Net Banking', i: 'fas fa-building-columns' },
                                ].map((p) => {
                                    const off = p.v !== 'cod' && onlineReady === false;
                                    return (
                                    <label key={p.v} title={off ? 'Online payment is not enabled on this demo' : undefined} style={{
                                        padding: '14px 16px', display: 'flex', alignItems: 'center',
                                        gap: 10, cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.5 : 1,
                                        border: `1.5px solid ${form.paymentMethod === p.v ? 'var(--primary)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius)',
                                        background: form.paymentMethod === p.v ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg)',
                                        fontWeight: 500, fontSize: 15, transition: 'all 0.2s',
                                    }}>
                                        <input type="radio" name="paymentMethod" value={p.v} checked={form.paymentMethod === p.v} onChange={onChange} disabled={off} style={{ width: 'auto' }} />
                                        <i className={p.i} style={{ color: 'var(--primary)' }}></i> {p.l}
                                    </label>
                                    );
                                })}
                            </div>
                            {onlineReady === false && (
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '-4px 0 14px' }}>
                                    <i className="fas fa-circle-info"></i> Online payment (Razorpay) is switched off on this demo, so orders use Cash on Delivery.
                                </p>
                            )}

                            {/* Payment-specific info card */}
                            <div style={{
                                padding: '16px 20px',
                                background: 'rgba(var(--primary-rgb), 0.06)',
                                border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                borderRadius: 'var(--radius)',
                                marginBottom: 18,
                                animation: 'fadeIn 0.3s ease',
                            }}>
                                {form.paymentMethod === 'cod' && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <i className="fas fa-circle-info" style={{ color: 'var(--primary)' }}></i>
                                            <strong style={{ fontSize: 15 }}>Pay on Delivery</strong>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                            Hand cash to the delivery partner when your order arrives. Please keep exact change ready.
                                        </p>
                                    </div>
                                )}

                                {form.paymentMethod === 'upi' && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                            <i className="fas fa-mobile-screen" style={{ color: 'var(--primary)' }}></i>
                                            <strong style={{ fontSize: 15 }}>UPI Payment</strong>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                            Pay instantly with PhonePe, Google Pay, Paytm or any UPI app. You'll be redirected to a secure Razorpay window.
                                        </p>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((u) => (
                                                <span key={u} style={{
                                                    background: 'rgba(var(--ink-rgb), 0.06)', padding: '6px 12px',
                                                    borderRadius: 100, fontSize: 12, fontWeight: 600,
                                                    border: '1px solid var(--border)',
                                                }}>
                                                    <i className="fab fa-google-pay" style={{ marginRight: 5, color: 'var(--primary)', display: u === 'GPay' ? 'inline' : 'none' }}></i>
                                                    {u}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {form.paymentMethod === 'card' && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                            <i className="fas fa-credit-card" style={{ color: 'var(--primary)' }}></i>
                                            <strong style={{ fontSize: 15 }}>Card Payment</strong>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                            Visa, Mastercard, RuPay, American Express accepted. 3D-Secure protected via Razorpay.
                                        </p>
                                        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <i className="fab fa-cc-visa" style={{ fontSize: 28, color: '#1a1f71' }}></i>
                                            <i className="fab fa-cc-mastercard" style={{ fontSize: 28, color: '#eb001b' }}></i>
                                            <i className="fab fa-cc-amex" style={{ fontSize: 28, color: '#006fcf' }}></i>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 10px', background: 'rgba(var(--ink-rgb), 0.06)', borderRadius: 100 }}>
                                                <i className="fas fa-shield-halved" style={{ marginRight: 4, color: 'var(--success)' }}></i> Secure
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {form.paymentMethod === 'netbanking' && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                            <i className="fas fa-building-columns" style={{ color: 'var(--primary)' }}></i>
                                            <strong style={{ fontSize: 15 }}>Net Banking</strong>
                                        </div>
                                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                            Pay directly from your bank account. Choose your bank in the next step (Razorpay).
                                        </p>
                                        <select
                                            name="bank"
                                            value={form.bank || ''}
                                            onChange={onChange}
                                            style={{ fontSize: 14 }}
                                        >
                                            <option value="">— Choose your bank —</option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="axis">Axis Bank</option>
                                            <option value="kotak">Kotak Mahindra Bank</option>
                                            <option value="yes">Yes Bank</option>
                                            <option value="pnb">Punjab National Bank</option>
                                            <option value="bob">Bank of Baroda</option>
                                            <option value="canara">Canara Bank</option>
                                            <option value="other">Other Bank</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 14 }}>
                                {loading
                                    ? <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                                    : form.paymentMethod === 'cod'
                                        ? <><i className="fas fa-bag-shopping"></i> Place Order — ₹{total.toFixed(2)}</>
                                        : <><i className="fas fa-credit-card"></i> Pay Now — ₹{total.toFixed(2)}</>
                                }
                            </button>
                        </form>
                    </Reveal>

                    <Reveal>
                        <div className="checkout-summary">
                            <h3>Order Summary</h3>
                            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
                                {items.map((it) => (
                                    <div key={it._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <img src={it.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600 }}>{it.name}</div>
                                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {it.quantity}</div>
                                        </div>
                                        <strong style={{ fontSize: 15 }}>₹{it.price * it.quantity}</strong>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
                            <div className="checkout-line"><span>Delivery</span><span>{deliveryFee === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `₹${deliveryFee}`}</span></div>
                            <div className="checkout-line"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                            <div className="checkout-line total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                            {subtotal < 599 && (
                                <p style={{ fontSize: 13, color: 'var(--accent)', marginTop: 12, textAlign: 'center' }}>
                                    Add ₹{599 - subtotal} more for free delivery 🚚
                                </p>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
