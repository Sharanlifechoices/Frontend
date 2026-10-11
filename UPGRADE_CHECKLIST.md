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
- [ ] Link old guest orders to the account by email on verify (moved to Phase 4: needs `orders` table)
- [ ] Smoke-test AuthBackend/SupabaseOtpStore against a real Supabase project (tests use fakes)

## Phase 3 — Catalog, cart, recommendations (backend)
- [x] Migration + seed: `catalog_items`
- [x] `GET /catalog`, `GET /catalog/{id}`
- [x] Cart API: get / add / update / remove / merge guest cart
- [x] `POST /cart/recommendations`
- [ ] Exclude already-purchased books from recommendations (wire `owned_ids` once `orders` exists, Phase 4)
- [ ] Admin catalog edits must call `CatalogRepo.invalidate()` (5-min cache) when admin catalog CRUD is added

## Phase 4 — Orders, payments, bookings
- [ ] `POST /checkout` (server-computed total)
- [ ] `POST /checkout/verify` (HMAC) + Razorpay webhook, both idempotent
- [ ] Sessions in cart require preferred date/time → `bookings`
- [ ] `GET /orders`, `GET /availability?date=`
- [ ] Standalone session booking endpoint

## Phase 5 — Email automation
- [ ] Purchase confirmation email
- [ ] 7-day follow-up job; birthday job; dedupe via `email_log`
- [ ] `POST /jobs/daily` protected by secret
- [x] Welcome email after OTP verification
- [ ] Cleanup job: delete unverified accounts older than 7 days

## Phase 6 — Admin backend (`X-Admin-Secret`)
- [ ] Purchases: all orders/items, filters, resend email
- [ ] Users: list, view, set password, delete
- [ ] Bookings status + availability management
- [ ] Gallery/retreats CRUD
- [ ] Newsletter: audience preview (12-month rule), batched send, status, unsubscribe

## Phase 7 — Frontend auth
- [ ] `src/lib/api.js` (bearer, auto-refresh, logging)
- [ ] `AuthContext`, `CartContext`
- [ ] Navbar: profile + cart icons
- [ ] Pages: Login, Signup (password-rule checklist), Verify OTP, Forgot/Reset, Profile
- [ ] Redirect-back after login, cart intact

## Phase 8 — Frontend commerce
- [ ] Books page card grid after KarmicCalculator
- [ ] BookDetail → Add to cart
- [ ] Cart page with recommendations
- [ ] Adding a service prompts preferred date/time
- [ ] Guest add-to-cart → sign in/up → cart preserved
- [ ] Razorpay checkout via backend order
- [ ] BookSession FAB: login gate; only service + date + time
- [ ] Remove BuyNowButton, EmailJS, Firebase usage

## Phase 9 — Frontend admin
- [ ] Admin-secret gate replaces PIN
- [ ] Tabs: Availability, Bookings, Purchases, Users, Gallery, Retreats, Newsletter

## Phase 10 — Migration & cleanup
- [ ] Firestore → Supabase one-off script (read-only on Firestore, JSON backup first)
- [ ] Remove `server/` PHP + EmailJS; rotate leaked EmailJS keys
- [ ] Update `CLAUDE.md`, backend README

## Phase 11 — Deployment
- [ ] Supabase: migrations + keys
- [ ] Render: `render.yaml`, `$PORT`, env, health check
- [ ] Vercel: `VITE_API_URL`, SPA rewrite, domain
- [ ] Resend domain via Zoho DNS; flip `EMAIL_MODE=resend`
- [ ] cron-job.org → `/jobs/daily`
- [ ] (Optional) port WhatsApp thank-you to backend
