import { Fragment, useCallback, useState } from 'react'
import { admin } from '../../lib/adminApi'
import { niceDate } from '../../lib/dates'
import { formatMoney } from '../../lib/money'
import { Badge, Status } from './shared'
import { STATUS_TONE, useAdminLoad, when } from './utils'

const PAGE = 50

export default function PurchasesTab() {
  const [status, setStatus] = useState('paid')
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const [since, setSince] = useState('')
  const [until, setUntil] = useState('')
  const [pages, setPages] = useState(1)
  const [open, setOpen] = useState(null)
  const [note, setNote] = useState('')

  const loader = useCallback(() => {
    const p = new URLSearchParams({ status, limit: String(PAGE * pages) })
    if (query) p.set('q', query)
    if (since) p.set('since', since)
    if (until) p.set('until', until)
    return admin.get(`/admin/orders?${p}`)
  }, [status, query, since, until, pages])
  const { data, loading, error } = useAdminLoad(loader)

  const resend = async (id) => {
    setNote('')
    try {
      await admin.post(`/admin/orders/${id}/resend-confirmation`)
      setNote('Confirmation email sent again.')
    } catch (e) {
      setNote(`Could not resend: ${e.message}`)
    }
  }
  const reset = (setter) => (e) => { setter(e.target.value); setPages(1) }
  const revenue = data ? data.orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total_minor, 0) : 0

  return (
    <div className="ad-section">
      <form className="ad-toolbar" onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); setPages(1) }}>
        <select className="ad-input" value={status} onChange={reset(setStatus)}>
          <option value="paid">Paid</option>
          <option value="created">Payment not completed</option>
          <option value="failed">Failed</option>
          <option value="all">All</option>
        </select>
        <input className="ad-input" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="ad-muted">From <input type="date" className="ad-input" value={since} onChange={reset(setSince)} /></label>
        <label className="ad-muted">To <input type="date" className="ad-input" value={until} onChange={reset(setUntil)} /></label>
        <button className="ad-btn ad-btn--primary" type="submit">Search</button>
      </form>
      {data && <p className="ad-muted">{data.total} order{data.total === 1 ? '' : 's'} · shown paid total: {formatMoney(revenue)}</p>}
      {note && <p className="ad-muted" role="status">{note}</p>}

      <Status loading={loading && pages === 1} error={error}>
        {data && (data.orders.length === 0 ? <p className="ad-muted ad-center">No purchases match.</p> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th /></tr></thead>
              <tbody>
                {data.orders.map((o) => (
                  <Fragment key={o.id}>
                    <tr className="ad-clickable" onClick={() => setOpen(open === o.id ? null : o.id)}>
                      <td>{when(o.paid_at || o.created_at)}</td>
                      <td><strong>{o.customer_name || '—'}</strong><br /><span className="ad-muted">{o.email}</span></td>
                      <td>{o.order_items.map((i) => i.title + (i.subtitle ? ` — ${i.subtitle}` : '')).join(', ')}</td>
                      <td>{formatMoney(o.total_minor, o.currency)}</td>
                      <td><Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge></td>
                      <td className="ad-muted">{open === o.id ? '▲' : '▼'}</td>
                    </tr>
                    {open === o.id && (
                      <tr className="ad-detail">
                        <td colSpan={6}>
                          <ul className="ad-list">
                            {o.order_items.map((i) => (
                              <li key={i.id}>{i.title}{i.subtitle ? ` — ${i.subtitle}` : ''} · {formatMoney(i.price_minor, i.currency)}
                                {i.preferred_date && <> · {niceDate(i.preferred_date)}, {i.preferred_time} SGT</>}
                              </li>
                            ))}
                          </ul>
                          <p className="ad-muted">Order {o.id}{o.razorpay_payment_id ? ` · Razorpay ${o.razorpay_payment_id}` : ''}{o.phone ? ` · ${o.phone}` : ''}{o.source === 'legacy' ? ' · migrated from the old site' : ''}</p>
                          {o.status === 'paid' && <button className="ad-btn" onClick={() => resend(o.id)}>Resend confirmation email</button>}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Status>
      {data && data.orders.length < data.total && <div className="ad-center"><button className="ad-btn" onClick={() => setPages((p) => p + 1)}>Load more</button></div>}
    </div>
  )
}
