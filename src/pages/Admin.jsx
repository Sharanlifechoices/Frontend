import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, writeBatch, query, orderBy, where, documentId, serverTimestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db } from '../firebase'
import { books } from '../data/booksData'
import { EMAILJS_SERVICE_ID, EMAILJS_PURCHASE_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, BOOKING_URL } from '../constants/emailjs'
import './Admin.css'

const ADMIN_PIN = 'sharan2024'
const TIME_SLOTS = ['11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM', '9:00 PM']
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(weekOffset = 0) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay() + weekOffset * 7)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('mlc_admin') === '1')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [tab, setTab] = useState('availability')
  const [weekOffset, setWeekOffset] = useState(0)
  const [availability, setAvailability] = useState({})
  const [bookedMap, setBookedMap] = useState({})
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingAvail, setLoadingAvail] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const availCacheRef = useRef({})
  const bookingsFetchedRef = useRef(false)
  const ordersFetchedRef = useRef(false)
  const galleryFetchedRef = useRef(false)
  const retreatsFetchedRef = useRef(false)

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [galleryTitle, setGalleryTitle] = useState('')
  const [galleryFile, setGalleryFile] = useState(null)
  const [galleryPreview, setGalleryPreview] = useState(null)

  const [resendingIds, setResendingIds] = useState(() => new Set())
  const [resendFeedback, setResendFeedback] = useState({})

  // Retreats gallery state
  const [retreatItems, setRetreatItems] = useState([])
  const [loadingRetreats, setLoadingRetreats] = useState(false)
  const [uploadingRetreat, setUploadingRetreat] = useState(false)
  const [retreatTitle, setRetreatTitle] = useState('')
  const [retreatFile, setRetreatFile] = useState(null)
  const [retreatPreview, setRetreatPreview] = useState(null)

  const weekDates = getWeekDates(weekOffset)
  const todayStr = toDateStr(new Date())

  const fetchAvailability = useCallback(async (offset) => {
    if (availCacheRef.current[offset]) {
      setAvailability(availCacheRef.current[offset].availability)
      setBookedMap(availCacheRef.current[offset].bookedMap)
      return
    }
    setLoadingAvail(true)
    try {
      const dates = getWeekDates(offset)
      const dateStrings = dates.map(toDateStr)
      const [availSnap, bookingsSnap] = await Promise.all([
        getDocs(query(collection(db, 'availability'), where(documentId(), 'in', dateStrings))),
        getDocs(query(collection(db, 'bookings'), where('date', 'in', dateStrings))),
      ])
      const availability = Object.fromEntries(dateStrings.map(s => [s, {}]))
      availSnap.docs.forEach(d => { availability[d.id] = d.data().slots || {} })

      const bookedMap = {}
      bookingsSnap.docs.forEach(d => {
        const b = d.data()
        if (b.status === 'cancelled') return
        if (!bookedMap[b.date]) bookedMap[b.date] = {}
        bookedMap[b.date][b.slot] = true
      })

      availCacheRef.current[offset] = { availability, bookedMap }
      setAvailability(availability)
      setBookedMap(bookedMap)
    } finally {
      setLoadingAvail(false)
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    try {
      const snap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')))
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      bookingsFetchedRef.current = true
    } finally {
      setLoadingBookings(false)
    }
  }, [])

  useEffect(() => {
    if (authed && tab === 'availability') fetchAvailability(weekOffset)
  }, [authed, tab, weekOffset, fetchAvailability])

  useEffect(() => {
    if (authed && tab === 'bookings' && !bookingsFetchedRef.current) fetchBookings()
  }, [authed, tab, fetchBookings])

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const snap = await getDocs(query(collection(db, 'bookOrders'), orderBy('createdAt', 'desc')))
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      ordersFetchedRef.current = true
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  useEffect(() => {
    if (authed && tab === 'orders' && !ordersFetchedRef.current) fetchOrders()
  }, [authed, tab, fetchOrders])

  const fetchGallery = useCallback(async () => {
    setLoadingGallery(true)
    try {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')))
      setGalleryItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.type !== 'retreat'))
      galleryFetchedRef.current = true
    } finally {
      setLoadingGallery(false)
    }
  }, [])

  useEffect(() => {
    if (authed && tab === 'gallery' && !galleryFetchedRef.current) fetchGallery()
  }, [authed, tab, fetchGallery])

  const fetchRetreats = useCallback(async () => {
    setLoadingRetreats(true)
    try {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')))
      setRetreatItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.type === 'retreat'))
      retreatsFetchedRef.current = true
    } finally {
      setLoadingRetreats(false)
    }
  }, [])

  useEffect(() => {
    if (authed && tab === 'retreats' && !retreatsFetchedRef.current) fetchRetreats()
  }, [authed, tab, fetchRetreats])

  const handleGalleryFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setGalleryFile(file)
    setGalleryPreview(URL.createObjectURL(file))
  }

  const handleGalleryUpload = async (e) => {
    e.preventDefault()
    if (!galleryFile || !galleryTitle.trim()) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', galleryFile)
      fd.append('upload_preset', 'ml_default')
      const res = await fetch('https://api.cloudinary.com/v1_1/dbb5nj0ht/image/upload', {
        method: 'POST', body: fd,
      })
      const data = await res.json()
      if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
      const docRef = await addDoc(collection(db, 'gallery'), {
        url: data.secure_url,
        title: galleryTitle.trim(),
        createdAt: new Date().toISOString(),
      })
      setGalleryItems(prev => [{ id: docRef.id, url: data.secure_url, title: galleryTitle.trim(), createdAt: new Date().toISOString() }, ...prev])
      setGalleryTitle('')
      setGalleryFile(null)
      setGalleryPreview(null)
      e.target.reset()
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryDelete = async (id) => {
    if (!window.confirm('Remove this image from the gallery?')) return
    try {
      await deleteDoc(doc(db, 'gallery', id))
      setGalleryItems(prev => prev.filter(g => g.id !== id))
    } catch {
      alert('Delete failed.')
    }
  }

  const handleRetreatFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setRetreatFile(file)
    setRetreatPreview(URL.createObjectURL(file))
  }

  const handleRetreatUpload = async (e) => {
    e.preventDefault()
    if (!retreatFile || !retreatTitle.trim()) return
    setUploadingRetreat(true)
    try {
      const fd = new FormData()
      fd.append('file', retreatFile)
      fd.append('upload_preset', 'ml_default')
      const res = await fetch('https://api.cloudinary.com/v1_1/dbb5nj0ht/image/upload', {
        method: 'POST', body: fd,
      })
      const data = await res.json()
      if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed')
      const docRef = await addDoc(collection(db, 'gallery'), {
        url: data.secure_url,
        title: retreatTitle.trim(),
        type: 'retreat',
        createdAt: new Date().toISOString(),
      })
      setRetreatItems(prev => [{ id: docRef.id, url: data.secure_url, title: retreatTitle.trim(), createdAt: new Date().toISOString() }, ...prev])
      setRetreatTitle('')
      setRetreatFile(null)
      setRetreatPreview(null)
      e.target.reset()
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploadingRetreat(false)
    }
  }

  const handleRetreatDelete = async (id) => {
    if (!window.confirm('Remove this image from the retreat gallery?')) return
    try {
      await deleteDoc(doc(db, 'gallery', id))
      setRetreatItems(prev => prev.filter(r => r.id !== id))
    } catch {
      alert('Delete failed.')
    }
  }

  const handleResendEmail = async (order) => {
    const book = books.find(b => `${b.title} — ${b.subtitle}` === order.bookTitle)
    if (!book) {
      setResendFeedback(prev => ({ ...prev, [order.id]: { ok: false, msg: 'Could not find PDF — check booksData.js' } }))
      return
    }
    setResendingIds(prev => new Set(prev).add(order.id))
    setResendFeedback(prev => ({ ...prev, [order.id]: null }))
    let ok = false
    let errMsg = ''
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_PURCHASE_TEMPLATE_ID, {
        to_email: order.email,
        to_name: order.name,
        book_title: order.bookTitle,
        pdf_link: book.pdfUrl,
        booking_link: BOOKING_URL,
      }, { publicKey: EMAILJS_PUBLIC_KEY })
      ok = true
    } catch (err) {
      errMsg = err?.text || err?.message || String(err)
    }
    try {
      await updateDoc(doc(db, 'bookOrders', order.id), ok
        ? { emailSent: true, emailSentAt: serverTimestamp() }
        : { emailSent: false, emailError: errMsg })
    } catch (_) {}
    setOrders(prev => prev.map(o => o.id === order.id
      ? { ...o, emailSent: ok, ...(ok ? {} : { emailError: errMsg }) }
      : o
    ))
    setResendFeedback(prev => ({ ...prev, [order.id]: {
      ok,
      msg: ok ? 'Email sent!' : `Failed: ${errMsg}`,
    } }))
    setResendingIds(prev => { const s = new Set(prev); s.delete(order.id); return s })
  }

  const login = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('mlc_admin', '1')
      setAuthed(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('mlc_admin')
    setAuthed(false)
    setPin('')
  }

  const isSlotEnabled = (dateStr, slot) => {
    const day = availability[dateStr]
    if (!day || day[slot] === undefined) return true
    return day[slot]
  }

  const toggleSlot = (dateStr, slot) => {
    setAvailability(prev => ({
      ...prev,
      [dateStr]: { ...(prev[dateStr] || {}), [slot]: !isSlotEnabled(dateStr, slot) }
    }))
  }

  const enableAll = (dateStr) => {
    setAvailability(prev => ({
      ...prev,
      [dateStr]: Object.fromEntries(TIME_SLOTS.map(s => [s, true]))
    }))
  }

  const disableAll = (dateStr) => {
    setAvailability(prev => ({
      ...prev,
      [dateStr]: Object.fromEntries(TIME_SLOTS.map(s => [s, false]))
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const batch = writeBatch(db)
      for (const [dateStr, slots] of Object.entries(availability)) {
        batch.set(doc(db, 'availability', dateStr), { slots })
      }
      await batch.commit()
      delete availCacheRef.current[weekOffset]
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('Save failed. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (bookingId, status) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status })
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b))
      availCacheRef.current = {}
    } catch {
      alert('Failed to update status.')
    }
  }

  if (!authed) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-lock-icon">🔐</div>
          <h2 className="admin-login-title">Admin Panel</h2>
          <p className="admin-login-sub">My LifeChoices — Sharan</p>
          <input
            type="password"
            className={`admin-pin-input ${pinError ? 'error' : ''}`}
            placeholder="Enter PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          {pinError && <p className="pin-error">Incorrect PIN. Try again.</p>}
          <button className="admin-primary-btn" onClick={login}>Enter Panel</button>
        </div>
      </div>
    )
  }

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
        <button
          className={`admin-tab-btn ${tab === 'availability' ? 'active' : ''}`}
          onClick={() => setTab('availability')}
        >
          📅 Availability
        </button>
        <button
          className={`admin-tab-btn ${tab === 'bookings' ? 'active' : ''}`}
          onClick={() => setTab('bookings')}
        >
          📋 Bookings
          {bookings.length > 0 && <span className="bookings-count">{bookings.length}</span>}
        </button>
        <button
          className={`admin-tab-btn ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          📚 Book Orders
          {orders.length > 0 && <span className="bookings-count">{orders.length}</span>}
        </button>
        <button
          className={`admin-tab-btn ${tab === 'gallery' ? 'active' : ''}`}
          onClick={() => setTab('gallery')}
        >
          🖼️ Gallery
        </button>
        <button
          className={`admin-tab-btn ${tab === 'retreats' ? 'active' : ''}`}
          onClick={() => setTab('retreats')}
        >
          🏔️ Retreats
        </button>
      </div>

      <div className="admin-content">

        {/* ── AVAILABILITY TAB ── */}
        {tab === 'availability' && (
          <div className="avail-section">
            <div className="avail-week-nav">
              <button className="week-arrow" onClick={() => setWeekOffset(o => o - 1)}>← Prev Week</button>
              <span className="week-range-label">
                {weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {' – '}
                {weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button className="week-arrow" onClick={() => setWeekOffset(o => o + 1)}>Next Week →</button>
            </div>

            {loadingAvail ? (
              <p style={{ color: '#b0adc8', textAlign: 'center', padding: '40px 0' }}>Loading availability…</p>
            ) : (
              <div className="avail-table-wrap">
                <table className="avail-table">
                  <thead>
                    <tr>
                      <th className="avail-th day-col">Day</th>
                      {TIME_SLOTS.map(s => <th key={s} className="avail-th">{s}</th>)}
                      <th className="avail-th">Quick</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekDates.map(date => {
                      const dateStr = toDateStr(date)
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                      const isToday = dateStr === todayStr
                      return (
                        <tr key={dateStr} className={isPast ? 'row-past' : ''}>
                          <td className={`avail-day-cell ${isToday ? 'is-today' : ''}`}>
                            <span className="day-name">{DAY_LABELS[date.getDay()]}</span>
                            <span className="day-num">{date.getDate()}</span>
                            {isToday && <span className="today-chip">Today</span>}
                          </td>
                          {TIME_SLOTS.map(slot => {
                            const enabled = isSlotEnabled(dateStr, slot)
                            const isBooked = bookedMap[dateStr]?.[slot]
                            return (
                              <td key={slot} className="avail-slot-cell">
                                {isBooked ? (
                                  <button
                                    className="slot-toggle-btn booked"
                                    disabled
                                    title="Booked by user — see Bookings tab"
                                  >
                                    📅
                                  </button>
                                ) : (
                                  <button
                                    className={`slot-toggle-btn ${enabled ? 'on' : 'off'}`}
                                    onClick={() => !isPast && toggleSlot(dateStr, slot)}
                                    disabled={isPast}
                                    title={enabled ? 'Click to disable' : 'Click to enable'}
                                  >
                                    {enabled ? '✓' : '✕'}
                                  </button>
                                )}
                              </td>
                            )
                          })}
                          <td className="avail-quick-cell">
                            <button className="quick-btn on-all" onClick={() => enableAll(dateStr)} disabled={isPast} title="Enable all">All On</button>
                            <button className="quick-btn off-all" onClick={() => disableAll(dateStr)} disabled={isPast} title="Disable all">All Off</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="avail-legend-row">
              <span className="legend-item"><span className="legend-dot on" />Enabled (bookable)</span>
              <span className="legend-item"><span className="legend-dot off" />Disabled (hidden from users)</span>
              <span className="legend-item"><span className="legend-dot booked-dot" />📅 Booked (user)</span>
              <button
                className={`admin-primary-btn save-btn ${saved ? 'btn-saved' : ''}`}
                onClick={handleSave}
                disabled={saving || loadingAvail}
              >
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && (
          <div className="bookings-section">
            <div className="bookings-header-row">
              <h3 className="bookings-title">All Bookings ({bookings.length})</h3>
              <button className="week-arrow" onClick={() => { bookingsFetchedRef.current = false; fetchBookings() }} disabled={loadingBookings}>
                {loadingBookings ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            {loadingBookings ? (
              <p style={{ color: '#b0adc8', textAlign: 'center', padding: '40px 0' }}>Loading bookings…</p>
            ) : bookings.length === 0 ? (
              <div className="empty-bookings">
                <p>No bookings yet.</p>
                <span>When users book sessions, they'll appear here.</span>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((b) => (
                  <div key={b.id} className={`booking-card booking-status-${b.status || 'pending'}`}>
                    <div className="booking-card-top">
                      <span className="booking-name">{b.name}</span>
                      <span className={`booking-service-badge service-${b.service}`}>{b.service}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>📧 {b.email}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>📱 {b.phone}</span>
                    </div>
                    <div className="booking-card-row booking-datetime">
                      <span>📅 {b.date}</span>
                      <span>🕐 {b.slot}</span>
                    </div>
                    <div className="booking-status-row">
                      <span className={`status-chip status-${b.status || 'pending'}`}>
                        {b.status || 'pending'}
                      </span>
                      {(b.status === 'pending' || !b.status) && (
                        <>
                          <button className="status-btn confirm-btn" onClick={() => updateStatus(b.id, 'confirmed')}>Confirm</button>
                          <button className="status-btn cancel-btn" onClick={() => updateStatus(b.id, 'cancelled')}>Cancel</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="status-btn cancel-btn" onClick={() => updateStatus(b.id, 'cancelled')}>Cancel</button>
                      )}
                      {b.status === 'cancelled' && (
                        <button className="status-btn confirm-btn" onClick={() => updateStatus(b.id, 'confirmed')}>Restore</button>
                      )}
                    </div>
                    <div className="booking-submitted">
                      Submitted: {new Date(b.createdAt).toLocaleString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ── BOOK ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="bookings-section">
            <div className="bookings-header-row">
              <h3 className="bookings-title">Book Orders ({orders.length})</h3>
              <button className="week-arrow" onClick={() => { ordersFetchedRef.current = false; fetchOrders() }} disabled={loadingOrders}>
                {loadingOrders ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>

            {loadingOrders ? (
              <p style={{ color: '#b0adc8', textAlign: 'center', padding: '40px 0' }}>Loading orders…</p>
            ) : orders.length === 0 ? (
              <div className="empty-bookings">
                <p>No purchases yet.</p>
                <span>When someone buys a book, it'll appear here.</span>
              </div>
            ) : (
              <div className="bookings-grid">
                {orders.map((o) => (
                  <div key={o.id} className="booking-card">
                    <div className="booking-card-top">
                      <span className="booking-name">{o.name || 'Unknown Buyer'}</span>
                      <span className="booking-service-badge">{o.currency} {(o.amount / 100).toFixed(2)}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>📖 {o.bookTitle}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>📧 {o.email}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>📱 {o.phone}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>🎂 {o.dob}</span>
                    </div>
                    <div className="booking-card-row">
                      <span>💳 {o.paymentId}</span>
                    </div>
                    <div className="booking-card-row" style={{ gap: 8 }}>
                      {o.emailSent === true && (
                        <span style={{ color: '#4ade80', fontSize: '0.8rem' }}>✓ Email sent</span>
                      )}
                      {o.emailSent === false && (
                        <span style={{ color: '#f87171', fontSize: '0.8rem' }} title={o.emailError || ''}>✗ Email failed</span>
                      )}
                      {o.emailSent === undefined && (
                        <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>— Email unknown</span>
                      )}
                    </div>
                    <div className="booking-status-row">
                      <button
                        className="status-btn confirm-btn"
                        onClick={() => handleResendEmail(o)}
                        disabled={resendingIds.has(o.id)}
                        style={{ fontSize: '0.78rem' }}
                      >
                        {resendingIds.has(o.id) ? 'Sending…' : '↩ Resend Email'}
                      </button>
                      {resendFeedback[o.id] && (
                        <span style={{ fontSize: '0.78rem', color: resendFeedback[o.id].ok ? '#4ade80' : '#f87171' }}>
                          {resendFeedback[o.id].msg}
                        </span>
                      )}
                    </div>
                    <div className="booking-submitted">
                      Purchased: {new Date(o.createdAt).toLocaleString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {tab === 'gallery' && (
          <div className="gallery-admin-section">
            <form className="gallery-upload-form" onSubmit={handleGalleryUpload}>
              <h3 className="bookings-title" style={{ marginBottom: 16 }}>Upload New Image</h3>
              <div className="gallery-upload-row">
                <input
                  type="text"
                  className="gallery-title-input"
                  placeholder="Image title"
                  value={galleryTitle}
                  onChange={e => setGalleryTitle(e.target.value)}
                  required
                />
                <label className="gallery-file-label">
                  {galleryFile ? galleryFile.name : 'Choose image…'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFileChange}
                    required
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="submit"
                  className="admin-primary-btn"
                  style={{ width: 'auto', marginTop: 0, padding: '10px 24px' }}
                  disabled={uploading || !galleryFile || !galleryTitle.trim()}
                >
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
              {galleryPreview && (
                <img src={galleryPreview} className="gallery-preview-img" alt="preview" />
              )}
            </form>

            {loadingGallery ? (
              <p style={{ color: '#b0adc8', textAlign: 'center', padding: '40px 0' }}>Loading gallery…</p>
            ) : galleryItems.length === 0 ? (
              <div className="empty-bookings">
                <p>No images yet.</p>
                <span>Uploaded images will appear here and on the public gallery page.</span>
              </div>
            ) : (
              <div className="gallery-admin-grid">
                {galleryItems.map(g => (
                  <div key={g.id} className="gallery-admin-card">
                    <img src={g.url} alt={g.title} className="gallery-admin-img" />
                    <div className="gallery-admin-info">
                      <span className="gallery-admin-title">{g.title}</span>
                      <span className="gallery-admin-date">
                        {new Date(g.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <button className="clear-btn gallery-del-btn" onClick={() => handleGalleryDelete(g.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RETREATS TAB ── */}
        {tab === 'retreats' && (
          <div className="gallery-admin-section">
            <form className="gallery-upload-form" onSubmit={handleRetreatUpload}>
              <h3 className="bookings-title" style={{ marginBottom: 16 }}>Upload Retreat Image</h3>
              <div className="gallery-upload-row">
                <input
                  type="text"
                  className="gallery-title-input"
                  placeholder="Image title"
                  value={retreatTitle}
                  onChange={e => setRetreatTitle(e.target.value)}
                  required
                />
                <label className="gallery-file-label">
                  {retreatFile ? retreatFile.name : 'Choose image…'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRetreatFileChange}
                    required
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  type="submit"
                  className="admin-primary-btn"
                  style={{ width: 'auto', marginTop: 0, padding: '10px 24px' }}
                  disabled={uploadingRetreat || !retreatFile || !retreatTitle.trim()}
                >
                  {uploadingRetreat ? 'Uploading…' : 'Upload'}
                </button>
              </div>
              {retreatPreview && (
                <img src={retreatPreview} className="gallery-preview-img" alt="preview" />
              )}
            </form>

            {loadingRetreats ? (
              <p style={{ color: '#b0adc8', textAlign: 'center', padding: '40px 0' }}>Loading retreat images…</p>
            ) : retreatItems.length === 0 ? (
              <div className="empty-bookings">
                <p>No retreat images yet.</p>
                <span>Uploaded images will appear on the Retreats page after the brochure.</span>
              </div>
            ) : (
              <div className="gallery-admin-grid">
                {retreatItems.map(r => (
                  <div key={r.id} className="gallery-admin-card">
                    <img src={r.url} alt={r.title} className="gallery-admin-img" />
                    <div className="gallery-admin-info">
                      <span className="gallery-admin-title">{r.title}</span>
                      <span className="gallery-admin-date">
                        {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <button className="clear-btn gallery-del-btn" onClick={() => handleRetreatDelete(r.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
