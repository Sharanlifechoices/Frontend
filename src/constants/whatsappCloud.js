// WhatsApp Cloud API purchase thank-you — sent via a server-side PHP
// endpoint (server/send-whatsapp-thankyou.php) since the Meta access token
// is a secret and must never live in src/. This is the public-safe URL
// only; deploy the PHP file to cPanel and point this at it.
export const WHATSAPP_THANKYOU_ENDPOINT = 'REPLACE_ME_WHATSAPP_ENDPOINT_URL'

// Unlike the birthday script's SHARED_SECRET (only ever known to a private
// cron-job config, never shipped to a browser), this endpoint is called
// directly from the browser, so whatever value it sends is visible to
// anyone inspecting network requests or this bundle. It is NOT a real
// secret — it only stops casual/accidental hits on the endpoint, not a
// determined attacker. Keep it in sync with SHARED_SECRET in
// server/send-whatsapp-thankyou.php.
export const WHATSAPP_THANKYOU_CLIENT_TOKEN = 'REPLACE_ME_BEFORE_UPLOAD'
