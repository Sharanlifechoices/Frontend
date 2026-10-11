import { useEffect, useState } from 'react'
import { api } from './api'

/** Open/blocked time slots for a YYYY-MM-DD date, from the backend. */
export function useAvailability(date) {
  const [result, setResult] = useState({ date: '', slots: [], error: '' })

  useEffect(() => {
    if (!date) return undefined
    let alive = true
    api.get(`/availability?date=${date}`, { auth: false })
      .then((r) => alive && setResult({ date, slots: r.slots, error: '' }))
      .catch((e) => alive && setResult({ date, slots: [], error: e.message }))
    return () => { alive = false }
  }, [date])

  const loading = Boolean(date) && result.date !== date
  return { slots: loading ? [] : result.slots, loading, error: loading ? '' : result.error }
}
