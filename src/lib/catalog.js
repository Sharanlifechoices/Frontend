import { api } from './api'

// The catalog is small and public, so it is fetched once per page load and shared.
let pending = null

export function getCatalog() {
  if (!pending) {
    pending = api.get('/catalog', { auth: false })
      .then(({ items }) => ({ items, byId: Object.fromEntries(items.map((i) => [i.id, i])) }))
      .catch((err) => {
        pending = null // let the next caller retry
        throw err
      })
  }
  return pending
}
