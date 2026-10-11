import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

/** Sends signed-out visitors to /login and brings them back here afterwards. */
export default function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return children
}
