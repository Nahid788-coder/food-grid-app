import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['classic', 'signature', 'veggie', 'spicy', 'sides', 'beverages', 'desserts'],
        },
        isVeg: { type: Boolean, default: false },
        isSpicy: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        rating: { type: Number, default: 4.5, min: 0, max: 5 },
        ingredients: [String],
        available: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
