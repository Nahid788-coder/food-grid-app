import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';

export default function MenuCard({ item, index = 0 }) {
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem(item);
        toast.success(`${item.name} added to cart`);
    };

    return (
        <motion.article
            className="menu-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: (index % 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="menu-card-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="menu-card-badges">
                    {item.isVeg && <span className="badge badge-veg">Veg</span>}
                    {item.isSpicy && <span className="badge badge-spicy">Spicy</span>}
                    {item.isFeatured && <span className="badge badge-feat">★ Popular</span>}
                </div>
                <div className="menu-card-rating">
                    <i className="fas fa-star"></i>
                    {(item.rating ?? 4.5).toFixed(1)}
                </div>
            </div>
            <div className="menu-card-body">
                <h3>{item.name}</h3>
                <p className="menu-card-desc">{item.description}</p>
                <div className="menu-card-foot">
                    <span className="menu-card-price">₹{item.price}</span>
                    <button className="add-btn" onClick={handleAdd}>
                        <i className="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </motion.article>
    );
}
