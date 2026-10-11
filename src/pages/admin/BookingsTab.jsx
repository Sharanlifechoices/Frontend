import { useCallback, useState } from 'react'
import { admin } from '../../lib/adminApi'
import { niceDate, sgtToday } from '../../lib/dates'
import { Badge, Status } from './shared'
import { STATUS_TONE, useAdminLoad, when } from './utils'

const PAGE = 50
const STATUSES = ['pending', 'confirmed', 'cancelled']

function whatsappLink(b) {
  const digits = (b.phone || '').replace(/\D/g, '')
  if (!digits) return null
  const text = `Hello ${b.name || ''}, this is Sharan's team about your ${b.service_title} session on ${niceDate(b.booking_date)} at ${b.slot} (SGT).`
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export default function BookingsTab() {
  const [status, setStatus] = useState('')
  const [upcomingOnly, setUpcomingOnly] = useState(true)
  const [pages, setPages] = useState(1)
  const [error, setActionError] = useState('')
  const today = sgtToday()

  const loader = useCallback(
    () => admin.get(`/admin/bookings?limit=${PAGE * pages}${status ? `&status=${status}` : ''}${upcomingOnly ? `&since=${today}` : ''}`),
    [status, upcomingOnly, pages, today],
  )
  const { data, loading, error: loadError, reload } = useAdminLoad(loader)

  const setBookingStatus = async (id, next) => {
    setActionError('')
    try {
      await admin.patch(`/admin/bookings/${id}`, { status: next })
      reload()
    } catch (e) {
      setActionError(e.message)
    }
  }

  return (
    <div className="ad-section">
      <div className="ad-toolbar">
        <select className="ad-input" value={status} onChange={(e) => { setStatus(e.target.value); setPages(1) }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="ad-check"><input type="checkbox" checked={upcomingOnly} onChange={(e) => { setUpcomingOnly(e.target.checked); setPages(1) }} /> Upcoming only</label>
        {data && <span className="ad-muted">{data.total} booking{data.total === 1 ? '' : 's'}</span>}
      </div>
      {error && <p className="ad-error" role="alert">{error}</p>}

      <Status loading={loading && pages === 1} error={loadError}>
        {data && (data.bookings.length === 0 ? <p className="ad-muted ad-center">No bookings match.</p> : (
          <div className="ad-cards">
            {data.bookings.map((b) => (
              <article className="ad-card" key={b.id}>
                <div className="ad-card-top">
                  <strong>{b.name || b.email}</strong>
                  <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
                </div>
                <p className="ad-big">{b.service_title}</p>
                <p>{niceDate(b.booking_date)} · {b.slot} <span className="ad-muted">SGT</span></p>
                <p className="ad-muted">{b.email}{b.phone ? ` · ${b.phone}` : ''}</p>
                <p className="ad-muted">Booked {when(b.created_at)}</p>
                <div className="ad-card-actions">
                  {STATUSES.filter((s) => s !== b.status).map((s) => (
                    <button key={s} className={`ad-btn ad-btn--${s}`} onClick={() => setBookingStatus(b.id, s)}>Mark {s}</button>
                  ))}
                  {whatsappLink(b) && <a className="ad-btn" href={whatsappLink(b)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                </div>
              </article>
            ))}
          </div>
        ))}
      </Status>
      {data && data.bookings.length < data.total && (
        <div className="ad-center"><button className="ad-btn" onClick={() => setPages((p) => p + 1)}>Load more</button></div>
      )}
    </div>
  )
}
