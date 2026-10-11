import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { AuthCard, Field, FormError, FormNotice } from '../../components/auth/AuthParts'
import './Auth.css'

export default function VerifyOtp() {
  const { user, verifyOtp, resendOtp } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/'
  const email = state?.email || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(state?.resendAfter ?? 60)

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  if (user) return <Navigate to={from} replace />
  if (!email) return <Navigate to="/signup" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { loggedIn } = await verifyOtp(email, code)
      if (loggedIn) navigate(from, { replace: true })
      else navigate('/login', { replace: true, state: { email, from, justVerified: true } })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const resend = async () => {
    setError('')
    setNotice('')
    try {
      await resendOtp(email)
      setNotice('A new code is on its way.')
      setCooldown(60)
    } catch (err) {
      const wait = /(\d+)s/.exec(err.message)
      if (err.status === 429 && wait) setCooldown(Number(wait[1]))
      setError(err.message)
    }
  }

  return (
    <AuthCard
      title="Check your email"
      subtitle={<>We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</>}
      footer={<>Wrong email? <Link to="/signup" state={{ from }}>Start again</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <Field label="Verification code">
          {(id) => (
            <input
              id={id} className="auth-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} autoFocus
            />
          )}
        </Field>
        <FormNotice>{notice}</FormNotice>
        <FormError>{error}</FormError>
        <button type="submit" className="btn-primary auth-submit" disabled={busy || code.length !== 6}>
          <span>{busy ? 'Verifying…' : 'Verify email'}</span>
        </button>
      </form>
      <p className="auth-aside">
        Didn’t get it?{' '}
        <button type="button" className="auth-link-btn inline" onClick={resend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </p>
    </AuthCard>
  )
}
