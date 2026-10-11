import { useState, useEffect, useRef } from 'react'
import { FaCalendarCheck, FaTimes } from 'react-icons/fa'
import { collection, addDoc, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { WHATSAPP_NUMBER } from '../whatsapp'
import { useScrollLock } from '../hooks/useScrollLock'
import { RZP_KEY } from '../constants/razorpay'
import './BookSession.css'

const ALL_SLOTS = ['11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM', '9:00 PM']
const SESSION_FEE_CENTS = 9600 // SGD 96.00

function getDateBounds() {
  const today = new Date()
  const max = new Date()
  max.setDate(today.getDate() + 30)
  const fmt = (d) => d.toISOString().split('T')[0]
  return { min: fmt(today), max: fmt(max) }
}

export default function BookSession() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', date: '' })
  const [submitted, setSubmitted] = useState(false)
  const [availableSlots, setAvailableSlots] = useState(ALL_SLOTS)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const slotCacheRef = useRef({})
  const { min, max } = getDateBounds()

  useScrollLock(isOpen)

  useEffect(() => {
    if (document.getElementById('razorpay-script')) return
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!formData.date) { setAvailableSlots(ALL_SLOTS); return }
    if (slotCacheRef.current[formData.date]) {
      setAvailableSlots(slotCacheRef.current[formData.date])
      return
    }
    setLoadingSlots(true)
    setSelectedSlot('')

    Promise.all([
      getDocs(query(collection(db, 'bookings'), where('date', '==', formData.date))),
      getDoc(doc(db, 'availability', formData.date)),
    ]).then(([bookingsSnap, availDoc]) => {
      const takenSlots = bookingsSnap.docs
        .filter(d => d.data().status !== 'cancelled')
        .map(d => d.data().slot)
      const adminConfig = availDoc.exists() ? (availDoc.data().slots || {}) : {}
      const slots = ALL_SLOTS.filter(s => !takenSlots.includes(s) && adminConfig[s] !== false)
      slotCacheRef.current[formData.date] = slots
      setAvailableSlots(slots)
    }).catch(() => setAvailableSlots(ALL_SLOTS))
      .finally(() => setLoadingSlots(false))
  }, [formData.date])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedSlot || !window.Razorpay) return

    setSubmitting(true)

    const options = {
      key: RZP_KEY,
      amount: SESSION_FEE_CENTS,
      currency: 'SGD',
      name: 'My LifeChoices',
      description: `${formData.service} Session — ${formData.date} at ${selectedSlot}`,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#7b2ff2' },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id
        try {
          const writePromise = addDoc(collection(db, 'bookings'), {
            ...formData,
            slot: selectedSlot,
            status: 'paid',
            paymentId,
            createdAt: new Date().toISOString(),
          })
          await Promise.race([
            writePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000)),
          ])
          delete slotCacheRef.current[formData.date]
        } catch (err) {
          console.error('Firestore error after payment:', err)
        }

        const text = `*New Booking — My LifeChoices*\n\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n🔮 Service: ${formData.service}\n📅 Date: ${formData.date}\n🕐 Time: ${selectedSlot}\n💳 Payment ID: ${paymentId}`
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')

        setSubmitting(false)
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setIsOpen(false)
          setSelectedSlot('')
          setFormData({ name: '', email: '', phone: '', service: '', date: '' })
        }, 2500)
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      console.error('Payment failed:', response.error)
      alert('Payment failed: ' + (response.error?.description || 'Please try again.'))
      setSubmitting(false)
    })
    rzp.open()
  }

  return (
    <>
      <button className="book-session-fab" onClick={() => setIsOpen(true)} aria-label="Book your session">
        <span className="fab-pulse" />
        <FaCalendarCheck className="fab-icon" />
        <span className="fab-text">Book Your Session</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>

            {submitted ? (
              <div className="book-success">
                <div className="success-icon">&#10003;</div>
                <h3>Booking Confirmed!</h3>
                <p>Payment received. We've opened WhatsApp so Sharan can confirm your session details.</p>
              </div>
            ) : (
              <>
                <h3 className="book-title">Book Your Session</h3>
                <p className="book-subtitle">Choose a time that works for you</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone / WhatsApp</label>
                    <input type="tel" required value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+65 xxxx xxxx" />
                  </div>
                  <div className="form-group">
                    <label>Service</label>
                    <select required value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}>
                      <option value="">Select a service</option>
                      <option value="Numerology">Numerology</option>
                      {/* <option value="BioGeometry">BioGeometry</option> */}
                      <option value="Meditation & Breathwork">Meditation & Breathwork</option>
                      <option value="Chakra Reading">Chakra Reading</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Date <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>(within 30 days)</span></label>
                    <input type="date" required min={min} max={max}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>
                      Preferred Time
                      <span style={{ display: 'block', fontWeight: 400, fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.3px', marginTop: 3 }}>
                        All times are in Singapore Time (SGT, UTC+8)
                      </span>
                    </label>
                    <div className="time-slots">
                      {loadingSlots ? (
                        <p style={{ color: '#b0adc8', fontSize: '0.85rem' }}>Checking availability…</p>
                      ) : availableSlots.length === 0 ? (
                        <p style={{ color: '#b0adc8', fontSize: '0.85rem' }}>No slots available for this date.</p>
                      ) : availableSlots.map((slot) => (
                        <button type="button" key={slot}
                          className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-primary book-submit" disabled={!selectedSlot || submitting}>
                    <span>{submitting ? 'Opening Payment…' : 'Pay SGD 96 & Confirm'}</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
