import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { passwordFailures } from '../../lib/password'
import { AuthCard, DateInput, Field, FormError, PasswordInput, PasswordRules } from '../../components/auth/AuthParts'
import './Auth.css'

const PHONE_RE = /^\+?[0-9][0-9 ()-]{6,19}$/
const today = () => new Date().toISOString().slice(0, 10)

function validate(f) {
  const errors = {}
  if (f.full_name.trim().length < 2) errors.full_name = 'Please enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = 'Enter a valid email address.'
  if (!f.dob) errors.dob = 'Please enter your date of birth.'
  else if (f.dob > today()) errors.dob = 'Date of birth cannot be in the future.'
  if (!PHONE_RE.test(f.phone.trim())) errors.phone = 'Enter a valid phone number (7-20 digits, may start with +).'
  if (passwordFailures(f.password).length) errors.password = 'Your password does not meet all the requirements below.'
  return errors
}

export default function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from || '/'
  const [form, setForm] = useState({ full_name: '', email: '', dob: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [existing, setExisting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={from} replace />

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const bind = (key) => ({ value: form[key], onChange: (e) => set(key)(e.target.value) })

  const submit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormError('')
    setExisting(false)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    try {
      const body = { ...form, full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim() }
      const res = await signup(body)
      navigate('/verify-email', { state: { email: body.email.toLowerCase(), from, resendAfter: res.resend_after } })
    } catch (err) {
      if (err.status === 409) {
        setExisting(true)
        setFormError('An account with this email already exists.')
      } else if (err.status === 422) {
        setErrors(err.fieldErrors)
        if (!Object.keys(err.fieldErrors).length) setFormError(err.message)
      } else {
        setFormError(err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="One account for sessions, books and your orders."
      footer={<>Already have an account? <Link to="/login" state={{ from }}>Sign in</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <Field label="Full name" error={errors.full_name}>
          {(id) => <input id={id} type="text" autoComplete="name" maxLength={80} {...bind('full_name')} />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(id) => <input id={id} type="email" autoComplete="email" {...bind('email')} />}
        </Field>
        <div className="auth-row">
          <Field label="Date of birth" error={errors.dob}>
            {(id) => <DateInput id={id} max={today()} autoComplete="bday" value={form.dob} onChange={set('dob')} />}
          </Field>
          <Field label="Phone number" error={errors.phone}>
            {(id) => <input id={id} type="tel" autoComplete="tel" placeholder="+65 8922 0656" {...bind('phone')} />}
          </Field>
        </div>
        <Field label="Password" error={errors.password}>
          {(id) => <PasswordInput id={id} value={form.password} onChange={set('password')} autoComplete="new-password" />}
        </Field>
        <PasswordRules password={form.password} submitted={submitted} />
        <FormError>{formError}</FormError>
        {existing && <p className="auth-aside"><Link to="/login" state={{ from, email: form.email }}>Sign in</Link> or <Link to="/forgot-password" state={{ email: form.email }}>reset your password</Link>.</p>}
        <button type="submit" className="btn-primary auth-submit" disabled={busy}>
          <span>{busy ? 'Creating account…' : 'Create account'}</span>
        </button>
      </form>
    </AuthCard>
  )
}
