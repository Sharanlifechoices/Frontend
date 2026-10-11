# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (http://localhost:5173)
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint (`eslint .`)

There is no test suite/framework configured in this project.

## Architecture

This is a single-page marketing/booking site for "My LifeChoices" (Sharan), built with Vite + React 19 + `react-router-dom` v7. There is no custom backend — **Firebase Firestore is the only data store**, accessed directly from the client (`src/firebase.js`).

### Routing (`src/App.jsx`)
All page components are lazy-loaded. Routing is a normal `<Routes>` tree, **except** the admin panel: `App.jsx` checks `pathname === '/secretadmin'` *before* rendering `<Routes>` and short-circuits straight to `<Admin />`, bypassing the navbar/footer/background chrome. It is not listed in the `<Routes>` block, so grep the pathname check in `App.jsx` if you need to find it.

`App.jsx` also uses this same pathname-branching pattern for one non-admin case: `isRetreats = pathname === '/retreats'` swaps the globally-mounted `<ContactUs />` FAB (the form-based WhatsApp modal used on every other page) for `<RetreatsContact />` (plain `mailto:`/`wa.me` links, no modal) — see `src/components/RetreatsContact.jsx`. If a page needs route-specific chrome without its own `<Route>` element, this is the established convention to extend rather than teaching a shared component about routes.

### Admin panel (`src/pages/Admin.jsx`)
Gated by a hardcoded PIN (`ADMIN_PIN` constant) stored via `sessionStorage`, not Firebase Auth. This means **there is no real authentication at the Firestore level** — the admin panel and all public-facing forms hit Firestore with the same anonymous client, so security rules must allow public read/write on the collections the app uses (see below). Tabs: Availability, Bookings, Book Orders, Gallery, Retreats — each tab lazily fetches its own collection on first activation (`*FetchedRef` refs guard against refetching).

### Firestore collections (schema lives only in code, not in a shared schema file)
- `bookings` — session bookings from `BookSession.jsx` (the floating "Book Your Session" FAB present on every page). Has a `status` field (`pending`/`confirmed`/`cancelled`) editable from Admin.
- `availability` — per-date slot overrides set by Admin, keyed by `YYYY-MM-DD` doc ID; consulted by `BookSession.jsx` alongside existing `bookings` to compute open slots.
- `bookOrders` — book purchases from `BuyNowButton.jsx` (used on `BookDetail.jsx`). After each purchase the handler also writes `emailSent` (bool), `emailSentAt` (Timestamp), and `emailError` (string, only on failure) fields to the same doc so admin can see delivery status.
- `gallery` — shared collection for both the public Gallery page and Retreats gallery; a `type: 'retreat'` field distinguishes retreat images from general gallery images (both are filtered client-side out of the same collection in `Admin.jsx`).

**Important gotcha:** Firestore Security Rules are managed only in the Firebase Console (project `sharan-24586`) — there is no `firestore.rules` file checked into this repo. When a new collection is introduced in code, its security rule must be added manually in the console or every read/write to it will fail with `permission-denied`. Because payment/booking write failures are caught in a `try/catch` and only `console.error`'d (the UI still shows a success state to the user regardless of whether the Firestore write succeeded), a missing rule for a collection is a silent failure — verify with a direct Firestore read/write test if orders/bookings aren't showing up in Admin.

### Payments (Razorpay)
Two independent Razorpay Checkout integrations, both client-side only, both using the same key from `src/constants/razorpay.js`:
- `src/components/BookSession.jsx` — session bookings, fixed fee (`SESSION_FEE_CENTS`), writes to `bookings`, then opens a prefilled WhatsApp message (`src/whatsapp.js` holds the destination number) so Sharan can manually confirm.
- `src/components/BuyNowButton.jsx` — book purchases, price/currency come from the matching entry in `src/data/booksData.js`, writes to `bookOrders`.

Both follow the same pattern: open Razorpay checkout → on `handler` success, write an order/booking doc to Firestore with a timeout race → update local UI state to "success" regardless of whether the Firestore write actually succeeded.

### Email (EmailJS, $0 cost)
Two independent email flows, both via [EmailJS](https://emailjs.com), no custom backend:
- **Purchase confirmation** — client-side only. `src/components/BuyNowButton.jsx` calls `emailjs.send(...)` (via `@emailjs/browser`) right after the `bookOrders` Firestore write, using IDs/keys from `src/constants/emailjs.js`. It emails a **link** to the book's PDF (`book.pdfUrl` in `src/data/booksData.js`, hosted on Cloudinary as a `raw` resource), never an attachment — EmailJS's free plan doesn't support attachments at a usable size. Wrapped in its own try/catch (`console.error` only), matching the existing "never block the success UI" pattern for Firestore writes in this file.
- **Birthday emails** — there is no backend/cron in this app, so this is a **standalone PHP script**, `server/send-birthday-emails.php`, that is *not* part of the Vite build and is uploaded manually to the cPanel host alongside `dist/`. A free https://cron-job.org job hits it once a day with a shared-secret query param; it reads `bookOrders` via Firestore's public REST API (no SDK needed), matches today's month/day against each order's `dob`, dedupes against a local `sent-birthdays.json` (hashed keys, `.htaccess`-protected) to avoid double-sends, and calls EmailJS's REST API directly with the **private** key (which must never appear in `src/` — it's server-only, unlike the public key). Session bookings (`bookings` collection) have no `dob` field and are intentionally excluded from birthday emails.
- All EmailJS IDs/keys in `src/constants/emailjs.js` and `server/send-birthday-emails.php` are placeholders (`REPLACE_ME_...`) — real values are filled in only on the deployed copies, never committed.

### Images / uploads
Cloudinary is used for image hosting. Book covers and page backgrounds are static Cloudinary URLs baked into source (e.g. `booksData.js`, inline `backgroundImage` styles in page components). Admin-uploaded Gallery/Retreats images go through an **unsigned** Cloudinary upload (`upload_preset: 'ml_default'`) directly from the browser in `Admin.jsx`, then the resulting URL is saved to the `gallery` Firestore collection.

### Deployment
Actual deployment is manual: `npm run build` then upload the contents of `dist/` to cPanel hosting. `vercel.json` (SPA rewrite of all paths to `/index.html`) is left over from an earlier/alternate Vercel-based deploy path and is not what's currently used — if deploying to cPanel, an equivalent rewrite rule (e.g. `.htaccess` with `mod_rewrite` falling back to `/index.html`) is needed for client-side routing to work on refresh/deep links, since cPanel serves static files with no built-in SPA fallback.
