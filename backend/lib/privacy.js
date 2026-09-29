// Read-only "demo admin" support: portfolio visitors can explore the dashboard,
// but never see real customer contact details.

export const maskPhone = (p = '') => {
    const d = String(p);
    return d.length > 4 ? `${'•'.repeat(Math.max(0, d.length - 4))}${d.slice(-4)}` : d;
};

const shortName = (n = '') => {
    const [first = '', last = ''] = String(n).trim().split(/\s+/);
    return last ? `${first} ${last[0]}.` : first;
};

const area = (a = '') => String(a).split(',').slice(-2).join(',').trim();

export function maskOrder(order) {
    const o = typeof order?.toObject === 'function' ? order.toObject() : { ...order };
    o.customerName = shortName(o.customerName);
    o.customerPhone = maskPhone(o.customerPhone);
    o.address = area(o.address);
    delete o.customerEmail;
    delete o.razorpayOrderId;
    delete o.razorpayPaymentId;
    if (o.user && typeof o.user === 'object') o.user = { name: shortName(o.user.name) };
    return o;
}

export function maskBooking(booking) {
    const b = typeof booking?.toObject === 'function' ? booking.toObject() : { ...booking };
    b.name = shortName(b.name);
    b.phone = maskPhone(b.phone);
    delete b.email;
    delete b.user;
    return b;
}

/** Send an order event to the admin room (full data) and the demo room (masked). */
export function notifyStaff(io, event, order) {
    if (!io) return;
    io.to('admin').emit(event, order);
    io.to('demo').emit(event, maskOrder(order));
}
