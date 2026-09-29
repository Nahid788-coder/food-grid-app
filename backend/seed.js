import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ensureSeed } from './lib/seedData.js';

dotenv.config();

// `npm run seed` resets the menu to the sample items and creates the admin if missing.
async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Seeding...');
    await ensureSeed({ resetMenu: true });
    console.log('Done.');
    await mongoose.disconnect();
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
