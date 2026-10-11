import { useCallback, useState } from 'react'
import { PasswordRules } from '../../components/auth/AuthParts'
import { admin } from '../../lib/adminApi'
import { niceDate } from '../../lib/dates'
import { formatMoney } from '../../lib/money'
import { passwordFailures } from '../../lib/password'
import { Badge, Status } from './shared'
import { STATUS_TONE, useAdminLoad, when } from './utils'

const PAGE = 50

/** A random password that satisfies the policy (length 14, lower, upper, digit, symbol). */
function generatePassword() {
  const sets = ['abcdefghjkmnpqrstuvwxyz', 'ABCDEFGHJKMNPQRSTUVWXYZ', '23456789', '!@#$%^&*?']
  const rand = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n
  const chars = sets.map((s) => s[rand(s.length)])
  const all = sets.join('')
  while (chars.length < 14) chars.push(all[rand(all.length)])
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = rand(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

function UserDetail({ id, onClose, onChanged }) {
  const loader = useCallback(() => admin.get(`/admin/users/${id}`), [id])
  const { data, loading, error } = useAdminLoad(loader)
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')

  const changePassword = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setMessage('')
    if (passwordFailures(password).length) return
    setBusy(true)
    try {
      await admin.put(`/admin/users/${id}/password`, { password })
      setMessage('Password updated. Tell the user their new password yourself (it is not emailed).')
      setPassword('')
      setSubmitted(false)
    } catch (err) {
      setMessage(err.fieldErrors?.password || err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await admin.delete(`/admin/users/${id}`)
      onChanged()
      onClose()
    } catch (err) {
      setMessage(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="ad-panel">
      <button className="ad-link ad-right" onClick={onClose}>Close ✕</button>
      <Status loading={loading} error={error}>
        {data && (
          <>
            <h3>{data.user.full_name || data.user.email}</h3>
            <p className="ad-muted">{data.user.email} · {data.user.phone || 'no phone'} · born {data.user.dob ? niceDate(data.user.dob) : '—'} · joined {when(data.user.created_at)}</p>
            <p><Badge tone={data.user.email_verified ? 'ok' : 'warn'}>{data.user.email_verified ? 'verified' : 'unverified'}</Badge> <Badge tone={data.user.is_unsubscribed ? 'bad' : 'ok'}>{data.user.is_unsubscribed ? 'unsubscribed' : 'subscribed'}</Badge></p>

            <h4>Set a new password</h4>
            <form onSubmit={changePassword} className="ad-stack">
              <div className="ad-toolbar">
                <input className="ad-input ad-grow" type="text" autoComplete="off" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="ad-btn" onClick={() => { setPassword(generatePassword()); setSubmitted(false) }}>Generate</button>
              </div>
              <PasswordRules password={password} submitted={submitted} />
              <button className="ad-btn ad-btn--primary" disabled={busy || !password}>Update password</button>
            </form>
            {message && <p className="ad-muted" role="status">{message}</p>}

            <h4>Purchases ({data.orders.filter((o) => o.status === 'paid').length})</h4>
            {data.orders.length === 0 ? <p className="ad-muted">None.</p> : (
              <ul className="ad-list">
                {data.orders.map((o) => (
                  <li key={o.id}>{when(o.paid_at || o.created_at)} · {formatMoney(o.total_minor, o.currency)} <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge><br />
                    <span className="ad-muted">{o.order_items.map((i) => i.title).join(', ')}</span></li>
                ))}
              </ul>
            )}

            <h4>Bookings ({data.bookings.length})</h4>
            {data.bookings.length === 0 ? <p className="ad-muted">None.</p> : (
              <ul className="ad-list">
                {data.bookings.map((b) => <li key={b.id}>{niceDate(b.booking_date)} · {b.slot} · {b.service_title} <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge></li>)}
              </ul>
            )}

            <h4>Delete account</h4>
            <p className="ad-muted">Removes the login and profile. Their orders and bookings stay on record. Type the email to confirm.</p>
            <div className="ad-toolbar">
              <input className="ad-input ad-grow" placeholder={data.user.email} value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
              <button className="ad-btn ad-btn--danger" disabled={busy || confirmEmail.trim().toLowerCase() !== data.user.email.toLowerCase()} onClick={remove}>Delete user</button>
            </div>
          </>
        )}
      </Status>
    </div>
  )
}

export default function UsersTab() {
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const [pages, setPages] = useState(1)
  const [selected, setSelected] = useState(null)
  const loader = useCallback(() => admin.get(`/admin/users?limit=${PAGE * pages}${query ? `&q=${encodeURIComponent(query)}` : ''}`), [query, pages])
  const { data, loading, error, reload } = useAdminLoad(loader)

  return (
    <div className="ad-section">
      <form className="ad-toolbar" onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); setPages(1) }}>
        <input className="ad-input ad-grow" placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="ad-btn ad-btn--primary" type="submit">Search</button>
        {data && <span className="ad-muted">{data.total} user{data.total === 1 ? '' : 's'}</span>}
      </form>

      <div className={selected ? 'ad-split' : ''}>
        <Status loading={loading && pages === 1} error={error}>
          {data && (data.users.length === 0 ? <p className="ad-muted ad-center">No users match.</p> : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th /></tr></thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.user_id} className={`ad-clickable ${selected === u.user_id ? 'ad-row-edited' : ''}`} onClick={() => setSelected(u.user_id)}>
                      <td><strong>{u.full_name || '—'}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>{when(u.created_at)}</td>
                      <td>{!u.email_verified && <Badge tone="warn">unverified</Badge>} {u.is_unsubscribed && <Badge tone="bad">unsub</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </Status>
        {selected && <UserDetail key={selected} id={selected} onClose={() => setSelected(null)} onChanged={reload} />}
      </div>
      {data && data.users.length < data.total && <div className="ad-center"><button className="ad-btn" onClick={() => setPages((p) => p + 1)}>Load more</button></div>}
    </div>
  )
}
