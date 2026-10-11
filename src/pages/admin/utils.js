import { useEffect, useMemo, useState } from 'react'

/**
 * Runs `loader` (a stable, memoised function) and tracks its result.
 * `loading` is derived, so a changed loader or a reload() never needs a synchronous setState in an effect.
 */
export function useAdminLoad(loader) {
  const [tick, setTick] = useState(0)
  const [state, setState] = useState({ request: null, data: null, error: '' })
  const request = useMemo(() => ({ tick }), [tick, loader]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true
    loader()
      .then((data) => alive && setState({ request, data, error: '' }))
      .catch((err) => alive && setState({ request, data: null, error: err.message }))
    return () => { alive = false }
  }, [request, loader])

  const loading = state.request !== request
  return { data: loading ? null : state.data, loading, error: loading ? '' : state.error, reload: () => setTick((t) => t + 1) }
}

export const STATUS_TONE = { paid: 'ok', confirmed: 'ok', sent: 'ok', pending: 'warn', sending: 'warn', partial: 'warn', created: 'muted', draft: 'muted', failed: 'bad', cancelled: 'bad' }

export const when = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')
