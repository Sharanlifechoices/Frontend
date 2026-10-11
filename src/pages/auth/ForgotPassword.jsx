import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { AuthCard, Field, FormError } from '../../components/auth/AuthParts'
import './Auth.css'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [email, setEmail] = useState(state?.email || '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await forgotPassword(email.trim())
      // The server answers the same way whether or not the account exists, so we always continue.
      navigate('/reset-password', { state: { email: email.trim().toLowerCase() } })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a code to set a new one."
      footer={<Link to="/login">Back to sign in</Link>}
    >
      <form onSubmit={submit} noValidate>
        <Field label="Email">
          {(id) => <input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />}
        </Field>
        <FormError>{error}</FormError>
        <button type="submit" className="btn-primary auth-submit" disabled={busy || !email}>
          <span>{busy ? 'Sending…' : 'Send code'}</span>
        </button>
      </form>
    </AuthCard>
  )
}
