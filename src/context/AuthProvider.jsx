import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, session } from '../lib/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false) // false until we know whether a stored session is still valid
  // Password typed at signup, kept in memory only (never persisted) so we can sign the user in after OTP verification.
  const pendingRef = useRef(null)

  useEffect(() => {
    let alive = true
    session.onLost(() => setUser(null))
    ;(async () => {
      if (session.hasRefreshToken()) {
        try {
          if (await session.restore()) {
            const me = await api.get('/me')
            if (alive) setUser(me)
          }
        } catch {
          /* stay signed out; the user can sign in again */
        }
      }
      if (alive) setReady(true)
    })()
    return () => { alive = false }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password }, { auth: false })
    session.setTokens(res)
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout') } catch { /* already expired is fine */ }
    session.clear()
    setUser(null)
  }, [])

  const signup = useCallback(async (form) => {
    const res = await api.post('/auth/signup', form, { auth: false })
    pendingRef.current = { email: form.email.trim().toLowerCase(), password: form.password }
    return res
  }, [])

  const resendOtp = useCallback((email) => api.post('/auth/resend-otp', { email }, { auth: false }), [])

  /** Verifies the code, then signs in automatically if we still hold the signup password. */
  const verifyOtp = useCallback(async (email, code) => {
    await api.post('/auth/verify-otp', { email, code }, { auth: false })
    const pending = pendingRef.current
    pendingRef.current = null
    if (pending && pending.email === email.trim().toLowerCase()) {
      try {
        await login(pending.email, pending.password)
        return { loggedIn: true }
      } catch {
        /* fall through to manual sign-in */
      }
    }
    return { loggedIn: false }
  }, [login])

  const forgotPassword = useCallback((email) => api.post('/auth/forgot-password', { email }, { auth: false }), [])
  const resetPassword = useCallback(
    (email, code, newPassword) => api.post('/auth/reset-password', { email, code, new_password: newPassword }, { auth: false }),
    [],
  )

  const updateProfile = useCallback(async (fields) => {
    const me = await api.patch('/me', fields)
    setUser(me)
    return me
  }, [])

  const setSubscribed = useCallback(async (subscribed) => {
    await api.put('/me/subscription', { subscribed })
    setUser((u) => (u ? { ...u, is_unsubscribed: !subscribed } : u))
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, logout, signup, resendOtp, verifyOtp, forgotPassword, resetPassword, updateProfile, setSubscribed }),
    [user, ready, login, logout, signup, resendOtp, verifyOtp, forgotPassword, resetPassword, updateProfile, setSubscribed],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
