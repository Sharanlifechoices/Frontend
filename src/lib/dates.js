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

export function niceDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
