# S. K. General STORE — Build Task Tracker

## Phase 1 – Project Foundation
- [/] Scaffold Next.js 14 + Tailwind CSS
- [ ] `next.config.js`, `tailwind.config.js`, `tsconfig.json`
- [ ] `app/globals.css` — design tokens + animations
- [ ] `app/layout.tsx` — root layout + SEO
- [ ] `public/manifest.json` — PWA manifest

## Phase 2 – Data Layer & API Routes
- [ ] `data/products.json` — 30+ seeds
- [ ] `data/orders.json`, `data/users.json`, `data/community.json`
- [ ] `lib/db.ts` — JSON CRUD helpers
- [ ] `app/api/products/route.ts` + `[id]/route.ts`
- [ ] `app/api/orders/route.ts` + `[id]/route.ts`
- [ ] `app/api/auth/route.ts`
- [ ] `app/api/users/route.ts`
- [ ] `app/api/reviews/route.ts`
- [ ] `app/api/community/route.ts`
- [ ] `app/api/ai/bill-scan/route.ts`

## Phase 3 – Shared Components & Contexts
- [ ] `lib/CartContext.tsx`
- [ ] `lib/AuthContext.tsx`
- [ ] `components/Navbar.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/ProductCard.tsx`
- [ ] `components/CartDrawer.tsx`
- [ ] `components/AdminSidebar.tsx`

## Phase 4 – Customer Storefront
- [ ] `app/(store)/page.tsx` — Home
- [ ] `app/(store)/products/page.tsx` — Catalog
- [ ] `app/(store)/product/[id]/page.tsx` — Product Detail
- [ ] `app/(store)/cart/page.tsx` — Cart
- [ ] `app/(store)/checkout/page.tsx` — Checkout
- [ ] `app/(store)/orders/page.tsx` — Order Tracking
- [ ] `app/(store)/profile/page.tsx` — Customer Profile
- [ ] `app/(store)/community/page.tsx` — Community
- [ ] `app/(store)/about/page.tsx`
- [ ] `app/(store)/contact/page.tsx`

## Phase 5 – Authentication
- [ ] `app/(auth)/login/page.tsx`
- [ ] `app/(auth)/register/page.tsx`

## Phase 6 – Admin Panel
- [ ] `app/admin/page.tsx` — Dashboard
- [ ] `app/admin/products/page.tsx`
- [ ] `app/admin/orders/page.tsx`
- [ ] `app/admin/customers/page.tsx`
- [ ] `app/admin/reviews/page.tsx`
- [ ] `app/admin/bill-scanner/page.tsx` — AI Scanner
- [ ] `app/admin/invoices/page.tsx`

## Phase 7 – Polish
- [ ] PWA service worker
- [ ] SEO metadata
- [ ] Final responsive checks
