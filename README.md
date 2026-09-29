# 🍕 Slice & Crust: Full-Stack Pizza Restaurant

An online ordering app for a wood-fired pizzeria. It has a pizza builder, live order tracking, online payments, table booking and an admin dashboard with charts.
Built by **[Nahid Husain Doi](https://portfolio-coral-nu-78.vercel.app)**.

**Stack:** React 19, Vite, Framer Motion, Socket.io client · Node.js, Express 5, Mongoose, Socket.io · MongoDB Atlas
**Hosting (all free):** Vercel (frontend) · Render (API) · MongoDB Atlas M0 (database)

---

## ✨ Features

### For customers
- A warm "Espresso Cream" light theme, using Fraunces for headings and DM Sans for text, that works on phones and desktops.
- The menu has category filters, search, ratings, and Veg / Spicy / Popular badges.
- **Pizza Customizer**: pick size, crust, sauce, cheese and up to 12 toppings, with a live preview and price.
- The cart is saved in the browser. Checkout offers **Cash on Delivery** or **Razorpay** (UPI, cards, net banking; test mode works without real money).
- **Live order tracking** with Socket.io: the status changes on screen without refreshing the page.
- Accounts use JWT. "My Orders" lists your history, and you can book a table.

### For the admin
- A live dashboard with charts showing 7-day revenue, orders by status and top-selling items.
- Real-time alerts for new orders.
- Order and booking status management, which pushes updates to the customer instantly.
- Menu management (create, edit, delete), with optional Cloudinary image upload.

### Security and reliability
- **Prices are calculated on the server.** The API reprices every order from the database, so a price changed in the browser is ignored. Custom pizzas are priced from a server-side price list.
- Razorpay orders are created from the order's stored total. Payments are checked with an HMAC signature and matched to the exact order.
- Orders and bookings are linked to the logged-in user, while guests can still order.
- The public tracking link masks the phone number and shows only the area of the address.
- Only a verified admin token can join the Socket.io admin room.
- The API uses Helmet, rate limiting on auth, orders, bookings and payments, a CORS allow-list, input limits and status validation.
- A new database gets the sample menu and the admin account automatically on first start, so the free Render plan works without a shell.
- The frontend shows a "waking up the server" notice when the free Render API is cold-starting.

---

## 🚀 Run locally

```bash
# 1. API
cd backend
cp .env.example .env      # set MONGO_URI and JWT_SECRET at minimum
npm install
npm run dev               # http://localhost:5000  (menu + admin are seeded on first start)

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

`npm run seed` resets the menu to the 16 sample items.

---

## 🌐 Deploy for free

### 1. Database: MongoDB Atlas (M0 free)
1. Create a free **M0** cluster at https://cloud.mongodb.com.
2. Go to **Database Access** and add a user with a password.
3. Go to **Network Access** and add `0.0.0.0/0`, because Render's free IPs change.
4. Go to **Connect → Drivers** and copy the connection string. Put your password in it and add a database name, like `.../slice-and-crust?retryWrites=true&w=majority`.

### 2. API: Render (free web service)
1. On https://render.com choose **New → Blueprint** and pick this repo. `render.yaml` sets everything up.
2. Fill in:
   - `MONGO_URI`: the Atlas string from above.
   - `CLIENT_URL`: your Vercel URL (you can add it after step 3).
   - `ADMIN_PASSWORD`: a password of your choice.
   - The Razorpay test keys (optional).
3. Deploy and open `https://<your-service>.onrender.com/api/health`. It should show `"db":"connected"`.

The free plan sleeps after 15 idle minutes, and the first request after that takes about 40 seconds.

### 3. Frontend: Vercel (Hobby, free)
1. **Add New → Project**, then import this repo and set **Root Directory** to `frontend`.
2. Add the environment variable `VITE_API_URL=https://<your-service>.onrender.com/api`.
3. Deploy, then put the Vercel URL into Render's `CLIENT_URL`.

---

## 🔑 Environment variables (`backend/.env`)

| Key | Required | Notes |
|-----|----------|-------|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Long random string. Render generates one for you |
| `CLIENT_URL` | ✅ in production | Frontend URL(s), comma separated |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | ✅ | The admin account created on first start |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Optional | Test-mode keys. Without them, only Cash on Delivery is offered |
| `CLOUDINARY_*` | Optional | Admin image upload. Without it, paste image URLs instead |

Frontend: `VITE_API_URL` is the API base URL. `VITE_BASE` is only needed for a sub-path build like GitHub Pages.

---

## 🌐 API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register`, `/api/auth/login` | — | Create account / sign in |
| GET | `/api/auth/me` | user | Current user |
| GET | `/api/menu` | — | Menu (`?category=&featured=`) |
| POST/PUT/DELETE | `/api/menu/:id` | admin | Manage menu |
| POST | `/api/orders` | optional | Place an order (items are ids and quantities, and the server sets prices) |
| GET | `/api/orders/track/:id` | — | Public tracking (contact details masked) |
| GET | `/api/orders/my` | user | My orders |
| GET | `/api/orders` · PUT `/api/orders/:id/status` | admin | All orders / update status (sends a socket event) |
| POST | `/api/bookings` | optional | Book a table |
| GET · PUT | `/api/bookings`, `/api/bookings/:id/status` | admin | Manage bookings |
| GET | `/api/payment/key` | — | Razorpay public key (if configured) |
| POST | `/api/payment/create-order`, `/api/payment/verify` | — | Razorpay order for an existing order / verify signature |
| POST | `/api/upload/image` | admin | Cloudinary upload |
| GET | `/api/stats` | admin | Dashboard numbers |
| GET | `/api/health` | — | Health check |

**Socket.io events:** `subscribe-order` · `admin-join` (needs an admin JWT) · `order-status-update` · `new-order` · `order-updated`

---

## 📦 Structure

```
backend/   Express API: models, routes, middleware, lib/pricing.js, lib/seedData.js, server.js
frontend/  React app: pages, components, context (auth, cart), api (axios, socket), styles
render.yaml  Render blueprint for the API
```

---

© 2026 Nahid Husain Doi
