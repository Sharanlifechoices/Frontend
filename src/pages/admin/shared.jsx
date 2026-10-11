import './AdminTabs.css'

export function Status({ loading, error, children }) {
  if (loading) return <p className="ad-muted ad-center">Loading…</p>
  if (error) return <p className="ad-error" role="alert">{error}</p>
  return children
}

export function Badge({ tone = 'muted', children }) {
  return <span className={`ad-badge ad-badge--${tone}`}>{children}</span>
}
