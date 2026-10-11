import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { AuthCard, Field, FormError, FormNotice, PasswordInput } from '../../components/auth/AuthParts'
import './Auth.css'

export default function Login() {
  const { user, login, resendOtp } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/'
  const [email, setEmail] = useState(state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [unverified, setUnverified] = useState(false)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setUnverified(false)
    setBusy(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      if (err.status === 403 && err.detail === 'email_not_verified') {
        setUnverified(true)
        setError('Please verify your email before signing in.')
      } else {
        setError(err.status === 401 ? 'Incorrect email or password.' : err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  const sendNewCode = async () => {
    setBusy(true)
    try {
      await resendOtp(email.trim())
    } catch { /* the verify page lets them retry and shows the cooldown */ }
    navigate('/verify-email', { state: { email: email.trim(), from } })
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to book sessions and buy books."
      footer={<>New here? <Link to="/signup" state={{ from }}>Create an account</Link></>}
    >
      <FormNotice>{state?.justVerified && 'Email verified. Sign in to continue.'}</FormNotice>
      <FormNotice>{state?.resetDone && 'Password updated. Sign in with your new password.'}</FormNotice>
      <form onSubmit={submit} noValidate>
        <Field label="Email">
          {(id) => <input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />}
        </Field>
        <Field label="Password">
          {(id) => <PasswordInput id={id} value={password} onChange={setPassword} autoComplete="current-password" />}
        </Field>
        <FormError>{error}</FormError>
        {unverified && <button type="button" className="auth-link-btn" onClick={sendNewCode} disabled={busy}>Send me a new code</button>}
        <button type="submit" className="btn-primary auth-submit" disabled={busy || !email || !password}>
          <span>{busy ? 'Signing in…' : 'Sign in'}</span>
        </button>
      </form>
      <p className="auth-aside"><Link to="/forgot-password" state={{ email }}>Forgot your password?</Link></p>
    </AuthCard>
  )
}
