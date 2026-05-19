import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: String,
        date: { type: Date, required: true },
        time: { type: String, required: true },
        guests: { type: Number, required: true, min: 1, max: 30 },
        note: String,
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
