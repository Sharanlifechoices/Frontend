import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { getCatalog } from '../lib/catalog'
import { useAuth } from './auth-context'
import { CartContext } from './cart-context'

// Guests keep their cart in localStorage. On sign-in it is merged into the server cart
// (idempotent on the server) and only cleared locally once the server has accepted it.
const GUEST_KEY = 'lc_guest_cart'
const EMPTY = { items: [], total_minor: 0, currency: 'SGD' }

const lineKey = (l) => `${l.item_id}|${l.preferred_date || ''}|${l.preferred_time || ''}`

function readGuest() {
  try {
    const raw = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((l) => l && typeof l.item_id === 'string') : []
  } catch {
    return []
  }
}

function writeGuest(lines) {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(lines)) } catch { /* private mode: cart lives in memory only */ }
}

export function CartProvider({ children }) {
  const { user, ready } = useAuth()
  const [guestLines, setGuestLines] = useState(readGuest)
  const [serverCart, setServerCart] = useState(EMPTY)
  const [catalog, setCatalog] = useState(null)
  const [notice, setNotice] = useState(null) // e.g. items skipped while merging the guest cart
  const userId = user?.id ?? null

  useEffect(() => {
    let alive = true
    getCatalog().then((c) => alive && setCatalog(c)).catch(() => {})
    return () => { alive = false }
  }, [])

  // Sync with the server whenever the signed-in user changes.
  useEffect(() => {
    if (!ready) return undefined
    let alive = true
    ;(async () => {
      if (!userId) {
        setServerCart(EMPTY)
        return
      }
      try {
        const local = readGuest()
        if (local.length) {
          const merged = await api.post('/cart/merge', { items: local })
          writeGuest([])
          if (!alive) return
          setGuestLines([])
          setServerCart(merged)
          if (merged.skipped?.length) setNotice(`${merged.skipped.length} item(s) from your earlier cart could not be added: ${merged.skipped.map((s) => s.reason).join('; ')}`)
        } else {
          const cart = await api.get('/cart')
          if (alive) setServerCart(cart)
        }
      } catch {
        /* keep the guest lines; the next sign-in or refresh retries the merge */
      }
    })()
    return () => { alive = false }
  }, [userId, ready])

  const guestItems = useMemo(() => {
    if (!catalog) return []
    return guestLines
      .map((l) => ({ l, item: catalog.byId[l.item_id] }))
      .filter(({ item }) => item && item.price_minor != null)
      .map(({ l, item }) => ({
        id: lineKey(l), item_id: item.id, type: item.type, title: item.title, subtitle: item.subtitle, cover: item.cover,
        route: item.route, price_minor: item.price_minor, currency: item.currency, requires_schedule: item.requires_schedule,
        preferred_date: l.preferred_date || null, preferred_time: l.preferred_time || null,
      }))
  }, [guestLines, catalog])

  const items = userId ? serverCart.items : guestItems
  const total_minor = userId ? serverCart.total_minor : guestItems.reduce((sum, i) => sum + i.price_minor, 0)
  const currency = items[0]?.currency || serverCart.currency || 'SGD'

  const addItem = useCallback(async (itemId, schedule = {}) => {
    if (userId) {
      const cart = await api.post('/cart/items', { item_id: itemId, preferred_date: schedule.date || null, preferred_time: schedule.time || null })
      setServerCart(cart)
      return { guest: false }
    }
    const item = catalog?.byId[itemId]
    if (item?.requires_schedule && !(schedule.date && schedule.time)) throw new Error('Please choose a preferred date and time for this session.')
    const line = { item_id: itemId, preferred_date: schedule.date || null, preferred_time: schedule.time || null }
    setGuestLines((prev) => {
      const next = prev.some((l) => lineKey(l) === lineKey(line)) ? prev : [...prev, line]
      writeGuest(next)
      return next
    })
    return { guest: true }
  }, [userId, catalog])

  const removeItem = useCallback(async (id) => {
    if (userId) {
      setServerCart(await api.delete(`/cart/items/${id}`))
      return
    }
    setGuestLines((prev) => {
      const next = prev.filter((l) => lineKey(l) !== id)
      writeGuest(next)
      return next
    })
  }, [userId])

  const updateSchedule = useCallback(async (id, { date, time }) => {
    if (userId) {
      setServerCart(await api.patch(`/cart/items/${id}`, { preferred_date: date, preferred_time: time }))
      return
    }
    setGuestLines((prev) => {
      const next = prev.map((l) => (lineKey(l) === id ? { ...l, preferred_date: date, preferred_time: time } : l))
      writeGuest(next)
      return next
    })
  }, [userId])

  const refresh = useCallback(async () => {
    if (userId) setServerCart(await api.get('/cart'))
  }, [userId])

  const recommendations = useCallback(
    async () => (await api.post('/cart/recommendations', { item_ids: items.map((i) => i.item_id) })).recommendations,
    [items],
  )

  const value = useMemo(
    () => ({
      items, count: items.length, total_minor, currency, catalog, notice, dismissNotice: () => setNotice(null),
      hasGuestItems: !userId && guestLines.length > 0, addItem, removeItem, updateSchedule, refresh, recommendations,
    }),
    [items, total_minor, currency, catalog, notice, userId, guestLines.length, addItem, removeItem, updateSchedule, refresh, recommendations],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
