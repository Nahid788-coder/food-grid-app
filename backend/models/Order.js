import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    image: String,
    description: String,
    category: String,
    price: Number,
    quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        customerEmail: String,
        address: { type: String, required: true },
        items: [orderItemSchema],
        subtotal: { type: Number, required: true },
        deliveryFee: { type: Number, default: 40 },
        tax: Number,
        total: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ['cod', 'card', 'upi'],
            default: 'cod',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        status: {
            type: String,
            enum: ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
            default: 'placed',
        },
        razorpayOrderId: { type: String, index: true },
        razorpayPaymentId: String,
        notes: String,
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
