// EmailJS (https://emailjs.com) — free-tier client-side email sending.
// These are the public-safe values only; the private key used by the
// birthday cron script lives server-side in server/send-birthday-emails.php.
export const EMAILJS_SERVICE_ID = 'service_rrk60nj'
export const EMAILJS_PUBLIC_KEY = 'jzXhEmwKRRHBT4JuN'
export const EMAILJS_PURCHASE_TEMPLATE_ID = 'template_q6kq9lr'

// Booking has no dedicated route — BookSession.jsx renders a floating FAB on
// every page — so the CTA in emails just links to the site itself.
export const BOOKING_URL = 'https://www.my-lifechoices.com/'
