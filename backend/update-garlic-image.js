import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

const NEW_IMAGE = 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=800&q=85&auto=format&fit=crop';

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await MenuItem.updateOne(
        { name: 'Garlic Bread Sticks' },
        { $set: { image: NEW_IMAGE } }
    );
    console.log('Matched:', result.matchedCount, '| Modified:', result.modifiedCount);
    process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
