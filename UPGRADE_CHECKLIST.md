# E-commerce Upgrade Checklist

Architecture: React (Vercel) → FastAPI backend (Render, repo `../sharan backend`) → Supabase (DB + auth) · Resend (send, mocked until `EMAIL_MODE=resend`) + Zoho (sender domain) · Razorpay (server-side orders).
Full plan: `C:\Users\ViditVaibhav\.claude\plans\so-our-requirement-have-tingly-moth.md`

## Phase 0 — Setup
- [x] Copy this checklist to `UPGRADE_CHECKLIST.md`
- [x] Create backend folder/repo `sharan backend`, copy tunefry core modules, strip billing/referrals, fix `_log` bug
- [x] `.env.example`, config via pydantic-settings, `/health`

## Phase 1 — Backend foundation
- [x] Request/response logging middleware with redaction + request-id
- [x] Outgoing-call logging (httpx hooks) for Supabase/Resend/Razorpay
- [x] Rate limiting on auth/OTP endpoints (in-memory sliding window, single instance; rightmost X-Forwarded-For)
- [x] Email module: `EMAIL_MODE=mock|resend`; mock logs full email (incl. OTP)
- [x] Branded HTML templates: OTP, welcome, purchase, 7-day follow-up, birthday, newsletter (+unsubscribe)
- [x] CORS for Vercel domain + localhost

## Phase 2 — Auth backend
- [x] SQL migration: profiles, email_otps (+ trigger for profile)
- [x] `POST /auth/signup` (unconfirmed Supabase user, no plaintext password stored, OTP sent)
- [x] `POST /auth/verify-otp`, `POST /auth/resend-otp`
- [x] `POST /auth/login`, `/auth/refresh`, `/auth/logout`
- [x] `POST /auth/forgot-password`, `/auth/reset-password`
- [x] `GET/PATCH /me`
- [x] Link old guest orders to the account by email on verify (moved to Phase 4: needs `orders` table)
- [x] Smoke-tested AuthBackend/OTP store/catalog/cart/orders against real Supabase (2026-10-11)

## Phase 3 — Catalog, cart, recommendations (backend)
- [x] Migration + seed: `catalog_items`
- [x] `GET /catalog`, `GET /catalog/{id}`
- [x] Cart API: get / add / update / remove / merge guest cart
- [x] `POST /cart/recommendations`
- [x] Exclude already-purchased books from recommendations (wire `owned_ids` once `orders` exists, Phase 4)
- [ ] Admin catalog edits must call `CatalogRepo.invalidate()` (5-min cache) when admin catalog CRUD is added

## Phase 4 — Orders, payments, bookings
- [x] `POST /checkout` (server-computed total)
- [x] `POST /checkout/verify` (HMAC) + Razorpay webhook, both idempotent
- [x] Sessions in cart require preferred date/time → `bookings`
- [x] `GET /orders`, `GET /availability?date=`
- [x] Standalone session booking endpoint
- [x] Migration 0003 applied; checkout against Razorpay TEST keys still to verify (live keys in .env: not exercised)

## Phase 5 — Email automation
- [x] Purchase confirmation email
- [x] 7-day follow-up job; birthday job; dedupe via `email_log` (migration 0004; needs running in Supabase)
- [x] `POST /jobs/daily` protected by `X-Jobs-Secret`
- [x] Welcome email after OTP verification
- [x] Cleanup job: delete unverified accounts older than 7 days (runs inside /jobs/daily)

## Phase 6 — Admin backend (`X-Admin-Secret`)
- [x] Purchases: all orders/items, filters, resend email
- [x] Users: list, view, set password, delete
- [x] Bookings status + availability management
- [x] Gallery/retreats CRUD (+ public `GET /gallery`; migration 0006 needs running)
- [x] Newsletter: audience preview (12-month rule), batched resumable send, status, test send
- [x] Unsubscribe: signed one-click links + List-Unsubscribe headers on follow-up/birthday (newsletter reuses `app/core/unsubscribe.py`), `GET|POST /unsubscribe`, `PUT /me/subscription` (migration 0005 needs running)

## Phase 7 — Frontend auth
- [x] `src/lib/api.js` (bearer, auto-refresh, dev logging) — verified against the live backend in Node
- [x] `AuthProvider`, `CartProvider` (guest cart in localStorage, merged on sign-in)
- [x] Navbar: profile + cart icons (badge, mobile layout)
- [ ] Visual check of navbar icons + auth pages in a browser at mobile width (you)
- [x] Pages: Login, Signup (live password-rule checklist), Verify OTP, Forgot/Reset, Profile (+ purchases, email toggle)
- [x] Redirect-back after login (`state.from`), cart intact (merge on sign-in)

## Phase 8 — Frontend commerce
- [x] Books page card grid after KarmicCalculator (prices from server catalog)
- [x] BookDetail → Add to cart + Buy now
- [x] Cart page with recommendations ("People also liked" / "exploring with Sharan Babaji")
- [x] Adding a service prompts preferred date/time (live slot availability)
- [x] Guest add-to-cart → sign in/up prompt → cart preserved
- [x] Razorpay checkout via backend order (server-confirmed success only)
- [x] BookSession FAB: login gate; only service + date + time
- [x] Removed BuyNowButton + client-side Razorpay (EmailJS stays until Admin rewrite in Phase 9; Gallery/Retreats/Admin still read Firestore until the Phase 10 migration)
- [ ] Browser test of the full flow with Razorpay test keys (you)

## Phase 9 — Frontend admin
- [x] Admin-secret gate replaces the PIN (server-checked X-Admin-Secret, kept in sessionStorage)
- [x] Tabs: Availability, Bookings, Purchases, Users (reset password), Gallery, Retreats, Newsletter — verified against the real backend + Supabase

## Phase 10 — Migration & cleanup
- [x] Firestore → Supabase import tool built and dry-run verified (3 orders, 11 bookings, 232 blocked-slot days, 46 gallery images). [x] `--apply` run: 3 orders, 11 bookings, 232 blocked days, 46 gallery images imported
- [x] Removed the PHP birthday script (EmailJS keys) and old scratch scripts; WhatsApp thank-you PHP kept until ported (optional). Rotate the old EmailJS keys (you)
- [x] Updated CLAUDE.md and the backend README

## Phase 11 — Deployment
- [ ] Supabase: migrations + keys
- [ ] Render: `render.yaml`, `$PORT`, env, health check
- [ ] Vercel: `VITE_API_URL`, SPA rewrite, domain
- [ ] Resend domain via Zoho DNS; flip `EMAIL_MODE=resend`
- [ ] cron-job.org → `/jobs/daily`
- [ ] (Optional) port WhatsApp thank-you to backend
