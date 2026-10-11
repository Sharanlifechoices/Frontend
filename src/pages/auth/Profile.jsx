import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { api } from '../../lib/api'
import { formatMoney } from '../../lib/money'
import { DateInput, Field, FormError, FormNotice } from '../../components/auth/AuthParts'
import './Auth.css'

const PHONE_RE = /^\+?[0-9][0-9 ()-]{6,19}$/
const today = () => new Date().toISOString().slice(0, 10)
const niceDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function Orders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    api.get('/orders').then((r) => alive && setOrders(r.orders)).catch((e) => alive && setError(e.message))
    return () => { alive = false }
  }, [])

  if (error) return <FormError>{error}</FormError>
  if (!orders) return <p className="auth-hint">Loading your orders…</p>
  if (!orders.length) return <p className="auth-hint">No purchases yet. <Link to="/books">Browse the books</Link>.</p>

  return (
    <ul className="orders-list">
      {orders.map((o) => (
        <li key={o.id}>
          <div className="orders-head">
            <span>{niceDate(o.paid_at || o.created_at)}</span>
            <strong>{formatMoney(o.total_minor, o.currency)}</strong>
          </div>
          <ul>
            {o.items.map((i, n) => (
              <li key={`${i.item_id}-${n}`}>
                {i.title}{i.subtitle ? ` — ${i.subtitle}` : ''}
                {i.preferred_date && <span className="auth-hint"> · {niceDate(i.preferred_date)}, {i.preferred_time} SGT (to be confirmed)</span>}
                {i.pdf_url && <> · <a href={i.pdf_url} target="_blank" rel="noopener noreferrer">Download PDF</a></>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default function Profile() {
  const { user, logout, updateProfile, setSubscribed } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: user.full_name || '', phone: user.phone || '', dob: user.dob || '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const bind = (key) => ({ value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) })

  const save = async (e) => {
    e.preventDefault()
    setMessage('')
    setFormError('')
    const found = {}
    if (form.full_name.trim().length < 2) found.full_name = 'Please enter your full name.'
    if (!PHONE_RE.test(form.phone.trim())) found.phone = 'Enter a valid phone number.'
    if (!form.dob || form.dob > today()) found.dob = 'Enter a valid date of birth.'
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      await updateProfile({ full_name: form.full_name.trim(), phone: form.phone.trim(), dob: form.dob })
      setMessage('Profile updated.')
    } catch (err) {
      if (err.status === 422) setErrors(err.fieldErrors)
      else setFormError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const toggleEmails = async (e) => {
    setMessage('')
    setFormError('')
    try {
      await setSubscribed(e.target.checked)
    } catch (err) {
      setFormError(err.message)
    }
  }

  const signOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <section className="auth-page profile-page">
      <div className="auth-card wide">
        <h1>Your account</h1>
        <p className="auth-subtitle">{user.email}</p>

        <h2>Details</h2>
        <form onSubmit={save} noValidate>
          <Field label="Full name" error={errors.full_name}>{(id) => <input id={id} type="text" maxLength={80} {...bind('full_name')} />}</Field>
          <div className="auth-row">
            <Field label="Date of birth" error={errors.dob}>{(id) => <DateInput id={id} max={today()} value={form.dob} onChange={(v) => setForm((f) => ({ ...f, dob: v }))} />}</Field>
            <Field label="Phone number" error={errors.phone}>{(id) => <input id={id} type="tel" {...bind('phone')} />}</Field>
          </div>
          <FormNotice>{message}</FormNotice>
          <FormError>{formError}</FormError>
          <button type="submit" className="btn-primary auth-submit" disabled={busy}><span>{busy ? 'Saving…' : 'Save changes'}</span></button>
        </form>

        <h2>Emails</h2>
        <label className="auth-check">
          <input type="checkbox" checked={!user.is_unsubscribed} onChange={toggleEmails} />
          Send me birthday wishes, follow-ups and newsletters
        </label>
        <p className="auth-hint">Order confirmations and account emails are always sent.</p>

        <h2>My purchases</h2>
        <Orders />

        <button type="button" className="btn-outline auth-signout" onClick={signOut}>Sign out</button>
      </div>
    </section>
  )
}
