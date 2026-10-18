# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173). Needs the backend running (see below).
- `npm run build` — production build
- `npm run lint` — ESLint (a few older files, `Home.jsx` and one line in `Navbar.jsx`, have known lint errors)

There is no frontend test suite. Backend tests live in the backend repo.

## Architecture

"My LifeChoices" (Sharan) is a Vite + React 19 + `react-router-dom` v7 SPA on **Vercel**, talking to a separate **FastAPI backend on Render** (repo: `Sharanlifechoices/Backend`, local `../sharan backend`) backed by **Supabase** (Postgres + auth). Email goes through Resend (sender domain on Zoho). Payments are Razorpay, with the **server** creating orders and verifying signatures. There is no Firebase and no EmailJS any more.

- API base URL: `VITE_API_URL` (see `.env.example`; defaults to `http://localhost:8000` in dev; set it on Vercel).
- `src/lib/api.js` is the only HTTP client. Access token lives **in memory**, refresh token in `localStorage` (`lc_refresh_token`); cross-site Vercel↔Render means no cookies. A 401 triggers one silent refresh (single-flight) and a retry. In dev every call is logged to the console (secrets redacted). Errors are `ApiError` (`.status`, `.detail`, `.fieldErrors`, `.requestId`, which matches the backend's `X-Request-ID` log field).
- `src/lib/adminApi.js` wraps it for admin calls (adds `X-Admin-Secret` from `sessionStorage`; any 403 logs out).

### Routing (`src/App.jsx`)
Lazy-loaded `<Routes>`, **except** `/secretadmin`, checked by pathname *before* `<Routes>` so it bypasses navbar/footer/FABs. The same pathname convention hides chrome elsewhere: `/retreats` swaps the Contact FAB for `RetreatsContact`; `/cart`, `/profile` and the sign-in pages (login, signup, verify-email, forgot/reset password) hide the floating Contact Us and Book Your Session buttons (`hideFabs`). Extend this convention rather than teaching shared components about routes.

### State (`src/context/`)
Contexts are split from hooks for fast-refresh lint rules: `auth-context.js` / `AuthProvider.jsx`, `cart-context.js` / `CartProvider.jsx`. Providers wrap `<App />` in `main.jsx`.
- **Auth**: signup (name, email, dob, optional phone, password; dates of birth use the typeable `DateInput`, DD/MM/YYYY text with a calendar button, because native date inputs show no keyboard on mobile) → emailed 6-digit OTP (`/verify-email`) → auto sign-in (the signup password is held in memory only, never persisted). Login, forgot/reset password, profile (`/profile`, also holds the email-subscription switch and "My purchases").
- **Cart**: guests keep lines in `localStorage` (`lc_guest_cart`); on sign-in they are merged into the server cart (`POST /cart/merge`, idempotent) and cleared locally only after the server accepts. `RequireAuth` and `state.from` return people to where they were.
- Password rules mirror the server (`src/lib/password.js` ↔ backend `app/core/passwords.py`); keep them in sync.

### Commerce
- Catalog (books, sessions, prices) comes from `GET /catalog`; `src/data/booksData.js` is **display content only** (covers, descriptions). Never trust a price from the browser; the server recomputes totals.
- `src/lib/checkout.js`: server creates the Razorpay order (`/checkout`, `/checkout/session`) → Razorpay window → `/checkout/verify`. The UI shows "paid" only after the server confirms; if verify cannot be reached the Razorpay webhook settles the order server-side and the UI says "payment received, finishing your order".
- Sessions need a preferred date + slot (Singapore time, within 30 days); slots come from `GET /availability`.
- Karmic number (digit sum of the DOB reduced to 1-9, also the book id) lives in `src/lib/karmic.js`; the Books page shows signed-in users their own number from `user.dob`, above the manual calculator.
- Components: `components/commerce/` (`AddToCartButton`, `ScheduleModal`, `AuthPrompt`, `BooksGrid`), `pages/Cart.jsx` (recommendations: "People also liked" / "exploring with Sharan Babaji"), `components/BookSession.jsx` (the floating button; signed-out visitors are sent to `/login`).

### Admin (`src/pages/Admin.jsx`, tabs in `src/pages/admin/`)
Gated by the shared admin secret, which the **backend** checks on every request (`X-Admin-Secret`). Tabs: Availability, Bookings, Purchases, Users (set password / delete), Gallery, Retreats, Newsletter. Images are uploaded to Cloudinary from the browser (`src/lib/cloudinary.js`, unsigned preset) and only the URL is stored in the backend.

### Other
Static marketing pages, Cloudinary-hosted images and backgrounds are unchanged. The public Gallery and Retreats pages read `GET /gallery`. `server/send-whatsapp-thankyou.php` is a leftover WhatsApp thank-you script that is no longer called by the site (porting it into the backend is optional); the old birthday PHP script was replaced by the backend's daily job.

## Gotchas
- Backend contract changes must be made in both repos. The cart/orders/admin response shapes are consumed directly by `src/pages/Cart.jsx`, `src/pages/auth/Profile.jsx` and `src/pages/admin/*`.
- Do not store tokens or the admin secret anywhere except where described above.
- The OTP email is mocked (`EMAIL_MODE=mock`) until Resend is configured on the backend; in mock mode read the code from the backend log.
- Deployment: Vercel serves `dist/` with the SPA rewrite in `vercel.json`. The old cPanel/`dist.zip` path is retired.
