import { Suspense, lazy, useEffect, useState } from 'react'
import { admin, adminSession } from '../lib/adminApi'
import './Admin.css'
import './admin/AdminTabs.css'

// Admin panel, gated by the shared admin secret (sent as X-Admin-Secret to the backend, which checks it).
// Reached only via the /secretadmin pathname check in App.jsx (no navbar/footer chrome).
const AvailabilityTab = lazy(() => import('./admin/AvailabilityTab'))
const BookingsTab = lazy(() => import('./admin/BookingsTab'))
const PurchasesTab = lazy(() => import('./admin/PurchasesTab'))
const UsersTab = lazy(() => import('./admin/UsersTab'))
const GalleryTab = lazy(() => import('./admin/GalleryTab'))
const NewsletterTab = lazy(() => import('./admin/NewsletterTab'))

const TABS = [
  { id: 'availability', label: '📅 Availability' },
  { id: 'bookings', label: '📋 Bookings' },
  { id: 'purchases', label: '🧾 Purchases' },
  { id: 'users', label: '👥 Users' },
  { id: 'gallery', label: '🖼️ Gallery' },
  { id: 'retreats', label: '🏔️ Retreats' },
  { id: 'newsletter', label: '✉️ Newsletter' },
]

function Login({ onSuccess }) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    adminSession.set(secret.trim())
    try {
      await admin.get('/admin/users?limit=1') // any admin call proves the secret
      onSuccess()
    } catch (err) {
      adminSession.clear()
      setError(err.status === 403 ? 'Incorrect secret.' : err.status === 429 ? 'Too many attempts. Wait 15 minutes and try again.' : err.message)
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-lock-icon">🔐</div>
        <h2 className="admin-login-title">Admin Panel</h2>
        <p className="admin-login-sub">My LifeChoices — Sharan</p>
        <input
          type="password" className={`admin-pin-input ad-secret-input ${error ? 'error' : ''}`} placeholder="Admin secret"
          value={secret} onChange={(e) => { setSecret(e.target.value); setError('') }} autoComplete="off" autoFocus
        />
        {error && <p className="pin-error">{error}</p>}
        <button className="admin-primary-btn" type="submit" disabled={busy || !secret.trim()}>{busy ? 'Checking…' : 'Enter Panel'}</button>
      </form>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(adminSession.get()))
  const [tab, setTab] = useState('availability')

  useEffect(() => {
    adminSession.onDenied(() => setAuthed(false)) // any 403 from the backend drops us back to the login screen
  }, [])

  const logout = () => {
    adminSession.clear()
    setAuthed(false)
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div>
          <span className="admin-brand">My LifeChoices</span>
          <span className="admin-header-sep">|</span>
          <span className="admin-header-label">Admin Panel</span>
        </div>
        <button className="admin-logout-btn" onClick={logout}>Logout</button>
      </header>

      <div className="admin-tabs-bar">
        {TABS.map((t) => (
          <button key={t.id} className={`admin-tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="admin-content">
        <Suspense fallback={<p className="ad-muted ad-center">Loading…</p>}>
          {tab === 'availability' && <AvailabilityTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'purchases' && <PurchasesTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'gallery' && <GalleryTab key="gallery" kind="gallery" />}
          {tab === 'retreats' && <GalleryTab key="retreat" kind="retreat" />}
          {tab === 'newsletter' && <NewsletterTab />}
        </Suspense>
      </div>
    </div>
  )
}
