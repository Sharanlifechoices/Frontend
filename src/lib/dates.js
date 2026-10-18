// Booking dates are Singapore dates (the server validates against Asia/Singapore).
export function sgtToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }) // YYYY-MM-DD
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const BOOKING_WINDOW_DAYS = 30

// Typed date of birth: keep the digits, insert slashes as DD/MM/YYYY. A pasted ISO date (1990-07-12) is converted.
export function formatDobText(raw) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  const digits = iso ? `${iso[3]}${iso[2]}${iso[1]}` : raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
}

// 'DD/MM/YYYY' -> 'YYYY-MM-DD', or '' unless it is a complete, real calendar date.
export function parseDobText(text) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text)
  if (!m) return ''
  const [, dd, mm, yyyy] = m
  const d = new Date(Date.UTC(+yyyy, +mm - 1, +dd))
  if (d.getUTCFullYear() !== +yyyy || d.getUTCMonth() !== +mm - 1 || d.getUTCDate() !== +dd) return ''
  return `${yyyy}-${mm}-${dd}`
}

export function isoToDobText(iso) {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? `${iso.slice(8)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : ''
}

export function niceDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
