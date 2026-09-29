import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

export const items = [
    { name: 'Margherita Classic', description: 'San Marzano tomato, fresh mozzarella, basil, olive oil, sea salt — the original.', price: 299, category: 'classic', isVeg: true, isFeatured: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=85&auto=format&fit=crop', ingredients: ['Tomato sauce','Fresh mozzarella','Basil','Olive oil'] },
    { name: 'Pepperoni Supreme', description: 'Loaded with premium pepperoni, mozzarella, oregano on a wood-fired crust.', price: 449, category: 'classic', isFeatured: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=85&auto=format&fit=crop', ingredients: ['Pepperoni','Mozzarella','Tomato sauce','Oregano'] },
    { name: 'BBQ Chicken Blaze', description: 'Tangy BBQ sauce, grilled chicken, red onion, cilantro, smoked mozzarella.', price: 499, category: 'signature', isSpicy: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=85&auto=format&fit=crop', ingredients: ['BBQ sauce','Grilled chicken','Red onion','Cilantro'] },
    { name: 'Truffle Mushroom', description: 'Wild mushrooms, truffle oil, fontina, thyme — earthy luxury on every slice.', price: 549, category: 'signature', isVeg: true, isFeatured: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=85&auto=format&fit=crop', ingredients: ['Wild mushrooms','Truffle oil','Fontina','Thyme'] },
    { name: 'Garden Veggie', description: 'Bell peppers, olives, mushrooms, onions, fresh tomatoes, mozzarella.', price: 379, category: 'veggie', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1542528180-a1208c5169a5?w=800&q=85&auto=format&fit=crop', ingredients: ['Bell peppers','Olives','Mushrooms','Onions'] },
    { name: 'Four Cheese', description: 'Mozzarella, gorgonzola, parmesan, ricotta on white sauce — pure cheesy bliss.', price: 469, category: 'veggie', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=85&auto=format&fit=crop', ingredients: ['Mozzarella','Gorgonzola','Parmesan','Ricotta'] },
    { name: 'Spicy Diavola', description: 'Spicy salami, jalapeños, red chili flakes, mozzarella — bring the heat.', price: 459, category: 'spicy', isSpicy: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&q=85&auto=format&fit=crop', ingredients: ['Spicy salami','Jalapeños','Chili flakes','Mozzarella'] },
    { name: 'Tandoori Paneer', description: 'Tandoori paneer, onions, capsicum, mint chutney drizzle. Fusion done right.', price: 429, category: 'spicy', isVeg: true, isSpicy: true, isFeatured: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=800&q=85&auto=format&fit=crop', ingredients: ['Tandoori paneer','Onions','Capsicum','Mint chutney'] },
    { name: 'Hawaiian Sunset', description: 'Smoked ham, sweet pineapple, mozzarella — sweet & savory perfection.', price: 419, category: 'classic', rating: 4.5, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=85&auto=format&fit=crop', ingredients: ['Ham','Pineapple','Mozzarella'] },
    { name: 'Garlic Bread Sticks', description: 'Buttery garlic bread sticks dusted with parmesan & parsley.', price: 149, category: 'sides', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=800&q=85&auto=format&fit=crop', ingredients: ['Bread','Garlic butter','Parmesan'] },
    { name: 'Crispy Fries', description: 'Golden hand-cut fries with house seasoning & dipping sauce.', price: 129, category: 'sides', isVeg: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=85&auto=format&fit=crop', ingredients: ['Potatoes','Sea salt','House seasoning'] },
    { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons, classic Caesar dressing.', price: 199, category: 'sides', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=85&auto=format&fit=crop', ingredients: ['Romaine','Parmesan','Croutons','Caesar dressing'] },
    { name: 'Coca-Cola', description: 'Chilled classic Coke — 500ml.', price: 60, category: 'beverages', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=85&auto=format&fit=crop', ingredients: ['Coca-Cola'] },
    { name: 'Iced Lemonade', description: 'Freshly squeezed lemon, mint, ice — refreshing and zesty.', price: 99, category: 'beverages', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=85&auto=format&fit=crop', ingredients: ['Lemon','Mint','Sugar','Ice'] },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center, vanilla ice cream side.', price: 179, category: 'desserts', isVeg: true, isFeatured: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=85&auto=format&fit=crop', ingredients: ['Dark chocolate','Vanilla ice cream'] },
    { name: 'Tiramisu', description: 'Classic Italian — coffee-soaked ladyfingers, mascarpone, cocoa.', price: 199, category: 'desserts', isVeg: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=85&auto=format&fit=crop', ingredients: ['Ladyfingers','Mascarpone','Coffee','Cocoa'] },
];

/**
 * Makes sure a fresh database has a menu and an admin account.
 * Runs on every boot (it only writes when something is missing), so the free
 * Render plan, which has no shell for `npm run seed`, still gets data.
 */
export async function ensureSeed({ resetMenu = false } = {}) {
    if (resetMenu) await MenuItem.deleteMany({});
    if ((await MenuItem.estimatedDocumentCount()) === 0) {
        await MenuItem.insertMany(items);
        console.log(`✓ Seeded ${items.length} menu items`);
    }

    const email = (process.env.ADMIN_EMAIL || 'admin@sliceandcrust.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const admin = await User.findOne({ email });
    if (!admin && password) {
        await User.create({ name: 'Admin', email, password, role: 'admin' });
        console.log(`✓ Admin user created: ${email}`);
    } else if (!admin) {
        console.warn('! No admin user: set ADMIN_EMAIL and ADMIN_PASSWORD to create one');
    }
}
