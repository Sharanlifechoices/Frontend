import { useId, useRef, useState } from 'react'
import { HiCalendar, HiEye, HiEyeOff } from 'react-icons/hi'
import { formatDobText, isoToDobText, parseDobText } from '../../lib/dates'
import { PASSWORD_RULES } from '../../lib/password'

export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </section>
  )
}

export function Field({ label, error, hint, children }) {
  const id = useId()
  return (
    <div className={`auth-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {error ? <span className="auth-error" role="alert">{error}</span> : hint ? <span className="auth-hint">{hint}</span> : null}
    </div>
  )
}

export function PasswordInput({ id, value, onChange, autoComplete, placeholder }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="auth-password">
      <input
        id={id} type={shown ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} placeholder={placeholder} maxLength={128}
      />
      <button type="button" onClick={() => setShown((s) => !s)} aria-label={shown ? 'Hide password' : 'Show password'}>
        {shown ? <HiEyeOff /> : <HiEye />}
      </button>
    </div>
  )
}

/** Live checklist: neutral until the user starts typing, then green when met and red when not. */
export function PasswordRules({ password, submitted }) {
  const active = password.length > 0 || submitted
  return (
    <ul className="pw-rules" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password)
        return (
          <li key={rule.id} className={ok ? 'ok' : active ? 'bad' : ''}>
            <span aria-hidden="true">{ok ? '✓' : active ? '✗' : '•'}</span> {rule.label}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Date of birth you can type (DD/MM/YYYY, numeric keypad on phones) with a calendar button as an alternative.
 * `value` and `onChange` use ISO YYYY-MM-DD; onChange gets '' until the text is a complete, real date.
 */
export function DateInput({ id, value, onChange, max, min, autoComplete, className = 'auth-date', style, onEnter }) {
  const [text, setText] = useState(() => isoToDobText(value))
  const [seen, setSeen] = useState(value)
  const picker = useRef(null)

  // Follow outside changes (profile prefill, reset) without clobbering what is being typed.
  if (value !== seen) {
    setSeen(value)
    if (value !== parseDobText(text)) setText(isoToDobText(value))
  }

  const type = (e) => {
    const next = formatDobText(e.target.value)
    setText(next)
    onChange(parseDobText(next))
  }
  const pick = (e) => {
    setText(isoToDobText(e.target.value))
    onChange(e.target.value)
  }
  const openCalendar = () => {
    try { picker.current?.showPicker() } catch { /* unsupported browser: typing still works */ }
  }

  return (
    <div className="auth-date-wrap">
      <input
        id={id} type="text" inputMode="numeric" value={text} onChange={type} maxLength={10}
        placeholder="DD/MM/YYYY" autoComplete={autoComplete} className={className} style={style}
        onKeyDown={onEnter ? (e) => { if (e.key === 'Enter') onEnter() } : undefined}
      />
      <button type="button" className="auth-date-btn" onClick={openCalendar} aria-label="Open calendar">
        <HiCalendar aria-hidden="true" />
      </button>
      <input
        ref={picker} type="date" tabIndex={-1} aria-hidden="true" className="auth-date-native"
        value={value || ''} min={min} max={max} onChange={pick}
      />
    </div>
  )
}

export function FormError({ children }) {
  return children ? <div className="auth-alert" role="alert">{children}</div> : null
}

export function FormNotice({ children }) {
  return children ? <div className="auth-alert success" role="status">{children}</div> : null
}
