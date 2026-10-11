import { useCallback, useMemo, useState } from 'react'
import { admin } from '../../lib/adminApi'
import { addDays, sgtToday } from '../../lib/dates'
import { Status } from './shared'
import { useAdminLoad } from './utils'

const SLOTS = ['11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM', '9:00 PM']
const dayLabel = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export default function AvailabilityTab() {
  const [offset, setOffset] = useState(0)
  const [edits, setEdits] = useState({}) // { day: [blocked slots] } for days changed but not yet saved
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const today = sgtToday()
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, offset * 7 + i)), [today, offset])

  const loader = useCallback(async () => {
    const [avail, booked] = await Promise.all([
      admin.get(`/admin/availability?since=${days[0]}&until=${days[6]}`),
      admin.get(`/admin/bookings?status=confirmed&since=${days[0]}&until=${days[6]}&limit=200`),
    ])
    return {
      blocked: Object.fromEntries(avail.days.map((d) => [d.day, d.blocked_slots])),
      booked: new Set(booked.bookings.map((b) => `${b.booking_date}|${b.slot}`)),
    }
  }, [days])
  const { data, loading, error, reload } = useAdminLoad(loader)

  const blockedFor = (day) => edits[day] ?? data?.blocked[day] ?? []
  const setBlocked = (day, slots) => { setEdits((e) => ({ ...e, [day]: slots })); setMessage('') }
  const toggle = (day, slot) => {
    const current = blockedFor(day)
    setBlocked(day, current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot])
  }

  const changed = Object.keys(edits)
  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      await Promise.all(changed.map((day) => admin.put(`/admin/availability/${day}`, { blocked_slots: edits[day] })))
      setEdits({})
      setMessage(`Saved ${changed.length} day${changed.length === 1 ? '' : 's'}.`)
      reload()
    } catch (e) {
      setMessage(`Save failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ad-section">
      <div className="ad-toolbar">
        <button className="ad-btn" onClick={() => setOffset((o) => o - 1)} disabled={offset <= 0}>← Previous week</button>
        <strong>{dayLabel(days[0])} – {dayLabel(days[6])}</strong>
        <button className="ad-btn" onClick={() => setOffset((o) => o + 1)}>Next week →</button>
      </div>
      <p className="ad-muted">Click a time to block it (red) or open it again. Booked times (confirmed bookings) are shown in gold and are always unavailable. Times are Singapore time.</p>

      <Status loading={loading} error={error}>
        {data && (
          <div className="ad-table-wrap">
            <table className="ad-table ad-avail">
              <thead><tr><th>Day</th>{SLOTS.map((s) => <th key={s}>{s}</th>)}<th>Quick</th></tr></thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className={edits[day] ? 'ad-row-edited' : ''}>
                    <td>{dayLabel(day)}{day === today && <span className="ad-today">today</span>}</td>
                    {SLOTS.map((slot) => {
                      const isBooked = data.booked.has(`${day}|${slot}`)
                      const isBlocked = blockedFor(day).includes(slot)
                      return (
                        <td key={slot}>
                          <button
                            type="button" disabled={isBooked}
                            className={`ad-slot ${isBooked ? 'booked' : isBlocked ? 'blocked' : 'open'}`}
                            onClick={() => toggle(day, slot)}
                          >
                            {isBooked ? 'Booked' : isBlocked ? 'Blocked' : 'Open'}
                          </button>
                        </td>
                      )
                    })}
                    <td className="ad-quick">
                      <button type="button" className="ad-link" onClick={() => setBlocked(day, [...SLOTS])}>Block all</button>
                      <button type="button" className="ad-link" onClick={() => setBlocked(day, [])}>Open all</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Status>

      <div className="ad-toolbar">
        <button className="ad-btn ad-btn--primary" onClick={save} disabled={saving || !changed.length}>
          {saving ? 'Saving…' : changed.length ? `Save changes (${changed.length} day${changed.length === 1 ? '' : 's'})` : 'No changes'}
        </button>
        {changed.length > 0 && <button className="ad-btn" onClick={() => setEdits({})}>Discard</button>}
        {message && <span className="ad-muted">{message}</span>}
      </div>
    </div>
  )
}
