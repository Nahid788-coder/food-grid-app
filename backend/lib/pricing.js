// Single source of truth for prices. The browser never decides what an order costs.
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';

export const CUSTOM = {
    sizes: { small: { label: 'Small', price: 199 }, medium: { label: 'Medium', price: 349 }, large: { label: 'Large', price: 499 } },
    crusts: {
        thin: { label: 'Thin & Crispy', extra: 0 },
        classic: { label: 'Classic Hand-Tossed', extra: 0 },
        'cheese-burst': { label: 'Cheese Burst', extra: 80 },
        'whole-wheat': { label: 'Whole Wheat', extra: 30 },
    },
    sauces: { tomato: 'Classic Tomato', pesto: 'Basil Pesto', bbq: 'Smoky BBQ', white: 'White (Cream)' },
    cheeses: {
        mozzarella: { label: 'Mozzarella', extra: 0 },
        cheddar: { label: 'Cheddar', extra: 30 },
        'four-cheese': { label: 'Four-Cheese Blend', extra: 60 },
        vegan: { label: 'Vegan Cheese', extra: 80 },
    },
    toppings: {
        pepperoni: { label: 'Pepperoni', price: 60 },
        chicken: { label: 'Grilled Chicken', price: 70 },
        sausage: { label: 'Italian Sausage', price: 60 },
        bacon: { label: 'Crispy Bacon', price: 70 },
        mushroom: { label: 'Mushrooms', price: 40 },
        onion: { label: 'Red Onion', price: 30 },
        pepper: { label: 'Bell Peppers', price: 35 },
        olives: { label: 'Black Olives', price: 45 },
        tomato: { label: 'Cherry Tomato', price: 35 },
        jalapeno: { label: 'Jalapeños', price: 40 },
        paneer: { label: 'Tandoori Paneer', price: 60 },
        corn: { label: 'Sweet Corn', price: 30 },
    },
};

export const FREE_DELIVERY_AT = 599;
export const DELIVERY_FEE = 40;
export const TAX_RATE = 0.05;
const CUSTOM_IMAGE = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=85&auto=format&fit=crop';

const fail = (msg) => Object.assign(new Error(msg), { status: 400 });

function priceCustom(c = {}) {
    const size = CUSTOM.sizes[c.size];
    const crust = CUSTOM.crusts[c.crust];
    const sauce = CUSTOM.sauces[c.sauce];
    const cheese = CUSTOM.cheeses[c.cheese];
    if (!size || !crust || !sauce || !cheese) throw fail('Invalid custom pizza options');
    const toppingIds = [...new Set(Array.isArray(c.toppings) ? c.toppings : [])];
    const toppings = toppingIds.map((id) => {
        const t = CUSTOM.toppings[id];
        if (!t) throw fail(`Unknown topping: ${id}`);
        return t;
    });
    const price = size.price + crust.extra + cheese.extra + toppings.reduce((s, t) => s + t.price, 0);
    const description = [size.label, crust.label, sauce, cheese.label, ...toppings.map((t) => t.label)].join(' • ');
    return { name: 'Build Your Own Pizza', description, price, image: CUSTOM_IMAGE, category: 'custom' };
}

/**
 * Turn the cart the browser sent into trusted order lines and totals.
 * Menu prices come from the database, custom pizzas from CUSTOM above.
 */
export async function priceCart(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) throw fail('Cart is empty');
    if (rawItems.length > 50) throw fail('Too many items');

    const ids = rawItems.filter((i) => i?.item && mongoose.isValidObjectId(i.item)).map((i) => String(i.item));
    const menu = await MenuItem.find({ _id: { $in: ids }, available: true }).lean();
    const byId = new Map(menu.map((m) => [String(m._id), m]));

    const items = rawItems.map((raw) => {
        const quantity = Math.min(20, Math.max(1, parseInt(raw?.quantity, 10) || 1));
        if (raw?.item) {
            const m = byId.get(String(raw.item));
            if (!m) throw fail('An item in your cart is no longer available');
            return { item: m._id, name: m.name, image: m.image, price: m.price, category: m.category, quantity };
        }
        if (raw?.custom) return { ...priceCustom(raw.custom), quantity };
        throw fail('Invalid cart item');
    });

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);
    return { items, subtotal, deliveryFee, tax, total };
}
