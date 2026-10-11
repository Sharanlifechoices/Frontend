import { useId, useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
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

/** Date field that opens the browser calendar when you click anywhere on it (not just the tiny icon). */
export function DateInput({ id, value, onChange, max, min, autoComplete }) {
  const open = (e) => {
    try { e.currentTarget.showPicker?.() } catch { /* not allowed in this context: the icon still works */ }
  }
  return (
    <input
      id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} onClick={open}
      min={min} max={max} autoComplete={autoComplete} className="auth-date"
    />
  )
}

export function FormError({ children }) {
  return children ? <div className="auth-alert" role="alert">{children}</div> : null
}

export function FormNotice({ children }) {
  return children ? <div className="auth-alert success" role="status">{children}</div> : null
}
