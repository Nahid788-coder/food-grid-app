# 🍕 Slice & Crust — Premium Full-Stack Pizza Restaurant

Production-ready restaurant ordering app with real-time order tracking, online payments, admin analytics, and a custom pizza builder.

**Stack:** React 19 + Vite + Framer Motion + Socket.io · Node.js + Express 5 + Mongoose · MongoDB

---

## ✨ Features

### Customer
- 🎨 Premium animated UI with hero, scroll reveals, page loader, scroll progress
- 🍕 Full menu with category filters, search, ratings, badges (Veg / Spicy / Featured)
- 🛠️ **Pizza Customizer** — build your own pizza (size, crust, sauce, cheese, 12 toppings) with live visual preview & price
- 🛒 Cart drawer with localStorage persistence
- 💳 Checkout with **Razorpay** integration (UPI / cards) + Cash on Delivery
- 📡 **Real-time order tracking** (Socket.io) — see status update live without refresh
- 🔐 JWT-based auth (register / login)
- 📜 "My Orders" history with status pills
- 📅 Table booking system
- 💬 Floating WhatsApp chat button

### Admin
- 📊 **Live Dashboard** with charts (Recharts) — revenue trend, order status pie, top items
- 🔔 Real-time new order notifications (Socket.io toast)
- 📦 Full Menu CRUD with **Cloudinary image upload**
- 📋 Manage orders — update status (placed → preparing → out → delivered)
- 📅 Manage table bookings
- 💰 Today's revenue, orders count, total stats

### UX Polish
- Skeleton loaders while data fetches
- Animated page loader on first visit
- Smooth Framer Motion reveals throughout
- Mobile-responsive (works perfectly on phones)
- Dark theme with warm orange accent

---

## 🚀 Quick Start

### 1. MongoDB
- **Local:** Install MongoDB Community → service auto-starts
- **Atlas (free, recommended):** https://cloud.mongodb.com → create M0 cluster → copy connection string

### 2. Backend
```bash
cd backend
npm install
# Edit .env — set MONGO_URI (and optionally Razorpay/Cloudinary keys)
npm run seed     # populates 16 menu items + admin user
npm run dev      # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

---

## 🔑 Environment Variables (`backend/.env`)

| Key | Required | Where to get |
|-----|----------|--------------|
| `MONGO_URI` | ✅ Yes | Local or [MongoDB Atlas](https://cloud.mongodb.com) (free) |
| `JWT_SECRET` | ✅ Yes | Any random string (32+ chars) |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | Optional | [Razorpay Dashboard](https://dashboard.razorpay.com) → Test Mode (free) |
| `CLOUDINARY_*` | Optional | [Cloudinary](https://cloudinary.com) (free 25GB) |

App works without Razorpay/Cloudinary — those features show graceful "not configured" messages.

---

## 🔐 Demo Credentials (after `npm run seed`)
- **Admin:** `admin@sliceandcrust.com` / `admin123`
- **Customer:** Register fresh at `/register`

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Auth** | | | |
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in |
| GET | `/api/auth/me` | user | Get current user |
| **Menu** | | | |
| GET | `/api/menu?category=&featured=` | — | List items |
| POST | `/api/menu` | admin | Add item |
| PUT | `/api/menu/:id` | admin | Update |
| DELETE | `/api/menu/:id` | admin | Delete |
| **Orders** | | | |
| POST | `/api/orders` | — | Place order |
| GET | `/api/orders/track/:id` | — | Track an order (public) |
| GET | `/api/orders/my` | user | My orders |
| GET | `/api/orders` | admin | All orders |
| PUT | `/api/orders/:id/status` | admin | Update status (emits socket event) |
| **Bookings** | | | |
| POST | `/api/bookings` | — | Create booking |
| GET | `/api/bookings` | admin | All bookings |
| PUT | `/api/bookings/:id/status` | admin | Update |
| **Payment (Razorpay)** | | | |
| GET | `/api/payment/key` | — | Get publishable key |
| POST | `/api/payment/create-order` | — | Create Razorpay order |
| POST | `/api/payment/verify` | — | Verify payment signature |
| **Upload (Cloudinary)** | | | |
| POST | `/api/upload/image` | admin | Upload image (multipart) |
| **Stats** | | | |
| GET | `/api/stats` | admin | Dashboard data (revenue, charts, top items) |

---

## 🔌 Socket.io Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `subscribe-order` | client → server | Subscribe to order status updates |
| `admin-join` | client → server | Admin joins admin room |
| `order-status-update` | server → client | Live order status push |
| `new-order` | server → admin | New order notification |
| `order-updated` | server → admin | Order changed |

---

## 📦 Folder Structure

```
pizza-app/
├── backend/
│   ├── models/         User, MenuItem, Order, Booking
│   ├── routes/         auth, menu, orders, bookings, payment, upload, stats
│   ├── middleware/     JWT auth + admin guard
│   ├── seed.js         Sample data
│   └── server.js       Express + Socket.io
└── frontend/
    └── src/
        ├── api/        axios + socket
        ├── components/ Navbar, Footer, CartDrawer, MenuCard, etc.
        ├── context/    Auth + Cart
        ├── pages/      Home, Menu, Customizer, About, Booking,
        │               Contact, Login, Register, Checkout, Orders,
        │               OrderTrack, Admin
        └── styles/     Global CSS with design tokens
```

---

## 🚢 Production Deployment

### Backend → Render (free)
1. Push backend to a GitHub repo
2. New Web Service → connect repo
3. Build: `npm install` · Start: `npm start`
4. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.

### Frontend → Vercel (free)
1. Push frontend to a GitHub repo
2. Import to Vercel → set `VITE_API_URL=https://your-backend.onrender.com/api`
3. Deploy

---

© 2026 Nahid Husain. All rights reserved.
