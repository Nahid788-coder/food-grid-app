# Graph Report - .  (2026-05-04)

## Corpus Check
- Corpus is ~13,467 words - fits in a single context window. You may not need a graph.

## Summary
- 115 nodes · 73 edges · 25 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth & Navigation|Auth & Navigation]]
- [[_COMMUNITY_Cart & Shopping|Cart & Shopping]]
- [[_COMMUNITY_App Core & API Client|App Core & API Client]]
- [[_COMMUNITY_Auth Guards & Interceptors|Auth Guards & Interceptors]]
- [[_COMMUNITY_Booking & Checkout Flow|Booking & Checkout Flow]]
- [[_COMMUNITY_Phone Input Component|Phone Input Component]]
- [[_COMMUNITY_Order Management|Order Management]]
- [[_COMMUNITY_Menu Customizer|Menu Customizer]]
- [[_COMMUNITY_Scroll Reset|Scroll Reset]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_Back To Top Button|Back To Top Button]]
- [[_COMMUNITY_Page Loader Overlay|Page Loader Overlay]]
- [[_COMMUNITY_Project Docs|Project Docs]]
- [[_COMMUNITY_Linting Setup|Linting Setup]]
- [[_COMMUNITY_Build Config|Build Config]]
- [[_COMMUNITY_HTML Shell|HTML Shell]]
- [[_COMMUNITY_Reveal Effects|Reveal Effects]]
- [[_COMMUNITY_Scroll Indicator|Scroll Indicator]]
- [[_COMMUNITY_WhatsApp Button|WhatsApp Button]]
- [[_COMMUNITY_About Section|About Section]]
- [[_COMMUNITY_Contact Section|Contact Section]]
- [[_COMMUNITY_Home Landing|Home Landing]]
- [[_COMMUNITY_Login Flow|Login Flow]]
- [[_COMMUNITY_Order History|Order History]]
- [[_COMMUNITY_Global Styles|Global Styles]]

## God Nodes (most connected - your core abstractions)
1. `API Client` - 7 edges
2. `useAuth()` - 6 edges
3. `useCart()` - 6 edges
4. `PhoneInput` - 5 edges
5. `Navbar()` - 3 edges
6. `Checkout()` - 3 edges
7. `Main Entry Point` - 3 edges
8. `Navbar` - 3 edges
9. `MenuCard` - 3 edges
10. `ProtectedRoute()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  src\App.jsx → src\context\AuthContext.jsx
- `CartDrawer()` --calls--> `useCart()`  [INFERRED]
  src\components\CartDrawer.jsx → src\context\CartContext.jsx
- `MenuCard()` --calls--> `useCart()`  [INFERRED]
  src\components\MenuCard.jsx → src\context\CartContext.jsx
- `Navbar()` --calls--> `useCart()`  [INFERRED]
  src\components\Navbar.jsx → src\context\CartContext.jsx
- `Checkout()` --calls--> `useAuth()`  [INFERRED]
  src\pages\Checkout.jsx → src\context\AuthContext.jsx

## Hyperedges (group relationships)
- **Context Provider Hierarchy** — main_entrypoint, authcontext_authprovider, cartcontext_cartprovider, app_app [EXTRACTED 1.00]
- **App Layout Shell** — navbar_navbar, footer_footer, cartdrawer_cartdrawer, backtotop_backtotop, pageloader_pageloader [EXTRACTED 1.00]
- **Menu Item Management** — menucard_menucard, menuitemform_menuitemform, menuskeleton_menuskeleton [INFERRED 0.90]
- **Authentication Flow** — login_login, register_register [INFERRED 0.90]
- **Order Management System** — checkout_checkout, orders_orders, ordertrack_ordertrack, admin_admin [INFERRED 0.95]
- **UI Enhancement System** — reveal_reveal, scrollprogress_scrollprogress, whatsappbutton_whatsappbutton [INFERRED 0.85]

## Communities

### Community 0 - "Auth & Navigation"
Cohesion: 0.15
Nodes (5): Navbar(), useAuth(), Login(), Register(), ProtectedRoute()

### Community 1 - "Cart & Shopping"
Cohesion: 0.17
Nodes (5): CartDrawer(), MenuCard(), useCart(), Checkout(), Customizer()

### Community 2 - "App Core & API Client"
Cohesion: 0.2
Nodes (10): App, AuthProvider, login, register, API Client, Request Interceptor, CartProvider, Main Entry Point (+2 more)

### Community 3 - "Auth Guards & Interceptors"
Cohesion: 0.2
Nodes (10): ProtectedRoute, logout, useAuth, Response Interceptor, addItem, useCart, CartDrawer, MenuCard (+2 more)

### Community 4 - "Booking & Checkout Flow"
Cohesion: 0.29
Nodes (7): Booking, Checkout, handleRazorpay, COUNTRIES, getFlagUrl, PhoneInput, Register

### Community 5 - "Phone Input Component"
Cohesion: 1.0
Nodes (2): flagUrl(), PhoneInput()

### Community 7 - "Order Management"
Cohesion: 0.67
Nodes (3): Admin, STATUS_FLOW, OrderTrack

### Community 23 - "Menu Customizer"
Cohesion: 1.0
Nodes (2): Customizer, Menu

### Community 29 - "Scroll Reset"
Cohesion: 1.0
Nodes (1): ScrollToTop

### Community 30 - "Footer"
Cohesion: 1.0
Nodes (1): Footer

### Community 31 - "Back To Top Button"
Cohesion: 1.0
Nodes (1): BackToTop

### Community 32 - "Page Loader Overlay"
Cohesion: 1.0
Nodes (1): PageLoader

### Community 33 - "Project Docs"
Cohesion: 1.0
Nodes (1): Slice & Crust Project

### Community 34 - "Linting Setup"
Cohesion: 1.0
Nodes (1): ESLint Config

### Community 35 - "Build Config"
Cohesion: 1.0
Nodes (1): Vite Config

### Community 36 - "HTML Shell"
Cohesion: 1.0
Nodes (1): Index HTML

### Community 37 - "Reveal Effects"
Cohesion: 1.0
Nodes (1): Reveal

### Community 38 - "Scroll Indicator"
Cohesion: 1.0
Nodes (1): ScrollProgress

### Community 39 - "WhatsApp Button"
Cohesion: 1.0
Nodes (1): WhatsAppButton

### Community 40 - "About Section"
Cohesion: 1.0
Nodes (1): About

### Community 41 - "Contact Section"
Cohesion: 1.0
Nodes (1): Contact

### Community 42 - "Home Landing"
Cohesion: 1.0
Nodes (1): Home

### Community 43 - "Login Flow"
Cohesion: 1.0
Nodes (1): Login

### Community 44 - "Order History"
Cohesion: 1.0
Nodes (1): Orders

### Community 45 - "Global Styles"
Cohesion: 1.0
Nodes (1): Global Styles

## Knowledge Gaps
- **36 isolated node(s):** `App`, `ProtectedRoute`, `ScrollToTop`, `Request Interceptor`, `Socket Client` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Phone Input Component`** (3 nodes): `flagUrl()`, `PhoneInput()`, `PhoneInput.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Menu Customizer`** (2 nodes): `Customizer`, `Menu`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scroll Reset`** (1 nodes): `ScrollToTop`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer`** (1 nodes): `Footer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Back To Top Button`** (1 nodes): `BackToTop`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Page Loader Overlay`** (1 nodes): `PageLoader`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Docs`** (1 nodes): `Slice & Crust Project`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Linting Setup`** (1 nodes): `ESLint Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Build Config`** (1 nodes): `Vite Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HTML Shell`** (1 nodes): `Index HTML`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reveal Effects`** (1 nodes): `Reveal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scroll Indicator`** (1 nodes): `ScrollProgress`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `WhatsApp Button`** (1 nodes): `WhatsAppButton`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `About Section`** (1 nodes): `About`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Contact Section`** (1 nodes): `Contact`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Landing`** (1 nodes): `Home`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Flow`** (1 nodes): `Login`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order History`** (1 nodes): `Orders`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Global Styles`** (1 nodes): `Global Styles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Auth & Navigation` to `Cart & Shopping`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `useCart()` connect `Cart & Shopping` to `Auth & Navigation`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `API Client` connect `App Core & API Client` to `Auth Guards & Interceptors`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `useAuth()` (e.g. with `ProtectedRoute()` and `Navbar()`) actually correct?**
  _`useAuth()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `useCart()` (e.g. with `CartDrawer()` and `MenuCard()`) actually correct?**
  _`useCart()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Navbar()` (e.g. with `useCart()` and `useAuth()`) actually correct?**
  _`Navbar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `App`, `ProtectedRoute`, `ScrollToTop` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._