import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
    const { items, removeItem, updateQty, subtotal, count, open, setOpen } = useCart();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Close the drawer whenever the page changes.
    useEffect(() => {
        setOpen(false);
    }, [pathname, setOpen]);

    const checkout = () => {
        setOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
            <aside className={`cart-drawer ${open ? 'open' : ''}`}>
                <div className="cart-head">
                    <h3>Your Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({count})</span></h3>
                    <button className="cart-close" onClick={() => setOpen(false)} aria-label="Close cart">
                        <i className="fas fa-xmark"></i>
                    </button>
                </div>

                <div className="cart-body">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <i className="fas fa-shopping-bag"></i>
                            <p>Your cart is empty</p>
                            <span>Add something delicious!</span>
                        </div>
                    ) : (
                        items.map((it) => (
                            <div key={it._id} className="cart-item">
                                <img src={it.image} alt={it.name} />
                                <div className="cart-item-info">
                                    <h4>{it.name}</h4>
                                    <p>₹{it.price * it.quantity}</p>
                                    <div className="cart-qty" style={{ marginTop: 6, width: 'fit-content' }}>
                                        <button onClick={() => updateQty(it._id, -1)} aria-label="Decrease"><i className="fas fa-minus"></i></button>
                                        <span>{it.quantity}</span>
                                        <button onClick={() => updateQty(it._id, 1)} aria-label="Increase"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(it._id)} className="cart-close" aria-label="Remove">
                                    <i className="fas fa-trash" style={{ fontSize: 13 }}></i>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-foot">
                        <div className="cart-total">
                            <span>Subtotal</span>
                            <strong>₹{subtotal}</strong>
                        </div>
                        <button className="btn btn-primary btn-block" onClick={checkout}>
                            <i className="fas fa-credit-card"></i> Checkout
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
