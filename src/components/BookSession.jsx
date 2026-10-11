import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCalendarCheck, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { checkoutSession } from '../lib/checkout'
import { addDays, BOOKING_WINDOW_DAYS, niceDate, sgtToday } from '../lib/dates'
import { formatMoney } from '../lib/money'
import { useAvailability } from '../lib/useAvailability'
import { useScrollLock } from '../hooks/useScrollLock'
import './BookSession.css'
import './commerce/Commerce.css'

// "Book Your Session" button, present on every page. Signed-out visitors are sent to sign in first;
// signed-in users only choose the service, date and time (their details come from the profile).
export default function BookSession() {
  const { user } = useAuth()
  const { catalog } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const { slots, loading, error: slotsError } = useAvailability(date)
  const min = sgtToday()
  const max = addDays(min, BOOKING_WINDOW_DAYS)
  const services = catalog?.items.filter((i) => i.type === 'service' && i.price_minor != null) ?? []
  const service = services.find((s) => s.id === serviceId)

  useScrollLock(isOpen)

  const open = () => {
    if (!user) {
      navigate('/login', { state: { from: pathname } })
      return
    }
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setResult(null)
    setError('')
  }

  const pickDate = (value) => {
    setDate(value)
    setTime('')
  }

  const pay = async (e) => {
    e.preventDefault()
    if (!service || !date || !time || busy) return
    setBusy(true)
    setError('')
    try {
      const outcome = await checkoutSession({ item_id: service.id, preferred_date: date, preferred_time: time })
      if (outcome.status === 'dismissed') setError(outcome.error ? `Payment was not completed: ${outcome.error}` : 'Payment was not completed. You have not been charged.')
      else setResult(outcome)
    } catch (err) {
      setError(err.paymentId ? `We could not verify your payment (reference ${err.paymentId}). If you were charged, please contact us with this reference.` : err.message)
    } finally {
      setBusy(false)
    }
  }

  const chosenIsOpen = slots.find((s) => s.time === time)?.available

  return (
    <>
      <button className="book-session-fab" onClick={open} aria-label="Book your session">
        <span className="fab-pulse" />
        <FaCalendarCheck className="fab-icon" />
        <span className="fab-text">Book Your Session</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Book your session">
            <button className="modal-close" onClick={close} aria-label="Close"><FaTimes /></button>

            {result ? (
              <div className="book-success">
                <div className="success-icon">&#10003;</div>
                <h3>{result.status === 'paid' ? 'Booking received!' : 'Payment received'}</h3>
                <p>
                  {result.status === 'paid'
                    ? `Thank you${user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! A receipt is on its way to your email, and Sharan’s team will confirm your session time.`
                    : 'We are finishing your booking and you will get an email shortly.'}
                </p>
                <div className="cm-actions">
                  <Link to="/profile" className="btn-primary" onClick={close}><span>View my bookings</span></Link>
                </div>
              </div>
            ) : (
              <>
                <h3 className="book-title">Book Your Session</h3>
                <p className="book-subtitle">Booking as {user?.full_name || user?.email}. Choose a time that works for you.</p>

                <form onSubmit={pay}>
                  <div className="form-group">
                    <label>Service</label>
                    <select required value={serviceId} onChange={(e) => setServiceId(e.target.value)} disabled={!catalog}>
                      <option value="">{catalog ? 'Select a service' : 'Loading…'}</option>
                      {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Date <span className="cm-muted">(within {BOOKING_WINDOW_DAYS} days)</span></label>
                    <input type="date" required min={min} max={max} value={date} onChange={(e) => pickDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>
                      Preferred Time
                      <span className="cm-muted cm-block">All times are in Singapore Time (SGT, UTC+8)</span>
                    </label>
                    <div className="time-slots">
                      {!date ? <p className="cm-muted">Choose a date first.</p>
                        : loading ? <p className="cm-muted">Checking availability…</p>
                          : slotsError ? <p className="cm-error">{slotsError}</p>
                            : slots.map((s) => (
                              <button
                                type="button" key={s.time} disabled={!s.available}
                                className={`time-slot ${time === s.time ? 'selected' : ''} ${s.available ? '' : 'unavailable'}`}
                                onClick={() => setTime(s.time)}
                              >
                                {s.time}
                              </button>
                            ))}
                    </div>
                  </div>
                  {error && <p className="cm-error" role="alert">{error}</p>}
                  <button type="submit" className="btn-primary book-submit" disabled={!service || !time || !chosenIsOpen || busy}>
                    <span>{busy ? 'Opening payment…' : service ? `Pay ${formatMoney(service.price_minor, service.currency)} & Confirm` : 'Choose a service'}</span>
                  </button>
                  {date && time && <p className="cm-muted cm-center">{niceDate(date)}, {time} SGT</p>}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
