import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { passwordFailures } from '../../lib/password'
import { AuthCard, Field, FormError, FormNotice, PasswordInput, PasswordRules } from '../../components/auth/AuthParts'
import './Auth.css'

export default function ResetPassword() {
  const { resetPassword, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [email, setEmail] = useState(state?.email || '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(`We've sent a 6-digit code to ${state?.email || 'your email'}.`)
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(60)

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setError('')
    if (passwordFailures(password).length) return
    setBusy(true)
    try {
      await resetPassword(email.trim(), code, password)
      navigate('/login', { replace: true, state: { email: email.trim(), resetDone: true } })
    } catch (err) {
      setError(err.fieldErrors?.new_password || err.message)
      setBusy(false)
    }
  }

  const resend = async () => {
    setError('')
    try {
      await forgotPassword(email.trim())
      setNotice('A new code is on its way.')
      setCooldown(60)
    } catch (err) {
      const wait = /(\d+)s/.exec(err.message)
      if (err.status === 429 && wait) setCooldown(Number(wait[1]))
      setError(err.message)
    }
  }

  return (
    <AuthCard title="Set a new password" subtitle="Enter the 6-digit code from your email and choose a new password." footer={<Link to="/login">Back to sign in</Link>}>
      <form onSubmit={submit} noValidate>
        <Field label="Email">
          {(id) => <input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />}
        </Field>
        <Field label="Verification code">
          {(id) => (
            <input
              id={id} className="auth-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          )}
        </Field>
        <Field label="New password">
          {(id) => <PasswordInput id={id} value={password} onChange={setPassword} autoComplete="new-password" />}
        </Field>
        <PasswordRules password={password} submitted={submitted} />
        <FormNotice>{notice}</FormNotice>
        <FormError>{error}</FormError>
        <button type="submit" className="btn-primary auth-submit" disabled={busy || !email || code.length !== 6}>
          <span>{busy ? 'Updating…' : 'Update password'}</span>
        </button>
      </form>
      <p className="auth-aside">
        <button type="button" className="auth-link-btn inline" onClick={resend} disabled={cooldown > 0 || !email}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </p>
    </AuthCard>
  )
}
