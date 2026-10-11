import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useScrollLock } from '../../hooks/useScrollLock'
import { addDays, BOOKING_WINDOW_DAYS, sgtToday } from '../../lib/dates'
import { useAvailability } from '../../lib/useAvailability'
import '../BookSession.css'
import './Commerce.css'

/** Asks for a preferred date and time slot (Singapore time). Used when a session is added to the cart. */
export default function ScheduleModal({ title, initial, confirmLabel = 'Confirm', busy = false, error = '', onConfirm, onClose }) {
  const [date, setDate] = useState(initial?.date || '')
  const [time, setTime] = useState(initial?.time || '')
  const { slots, loading, error: slotsError } = useAvailability(date)
  const min = sgtToday()
  const max = addDays(min, BOOKING_WINDOW_DAYS)
  useScrollLock(true)

  const pickDate = (value) => {
    setDate(value)
    setTime('')
  }
  const chosenIsOpen = slots.find((s) => s.time === time)?.available

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        <h3 className="book-title">{title}</h3>
        <p className="book-subtitle">When would you like to meet? Sharan’s team confirms the final time.</p>

        <div className="form-group">
          <label>Preferred date <span className="cm-muted">(within {BOOKING_WINDOW_DAYS} days)</span></label>
          <input type="date" min={min} max={max} value={date} onChange={(e) => pickDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>
            Preferred time
            <span className="cm-muted cm-block">All times are Singapore Time (SGT, UTC+8)</span>
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
        <button
          type="button" className="btn-primary book-submit" disabled={!date || !time || !chosenIsOpen || busy}
          onClick={() => onConfirm({ date, time })}
        >
          <span>{busy ? 'Please wait…' : confirmLabel}</span>
        </button>
      </div>
    </div>
  )
}
