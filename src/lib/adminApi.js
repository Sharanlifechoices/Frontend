// Admin calls: same client as the public site, plus the shared secret in X-Admin-Secret.
// The secret lives in sessionStorage only (cleared when the tab closes) and is dropped on any 403.
import { api, ApiError } from './api'

const KEY = 'lc_admin_secret'
let onDenied = () => {}

export const adminSession = {
  get() { try { return sessionStorage.getItem(KEY) } catch { return null } },
  set(value) { try { sessionStorage.setItem(KEY, value) } catch { /* private mode */ } },
  clear() { try { sessionStorage.removeItem(KEY) } catch { /* ignore */ } },
  onDenied(fn) { onDenied = fn },
}

async function call(method, path, body) {
  const opts = { auth: false, headers: { 'X-Admin-Secret': adminSession.get() || '' } }
  try {
    return method === 'get' || method === 'delete' ? await api[method](path, opts) : await api[method](path, body, opts)
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      adminSession.clear()
      onDenied()
    }
    throw err
  }
}

export const admin = {
  get: (path) => call('get', path),
  post: (path, body) => call('post', path, body),
  put: (path, body) => call('put', path, body),
  patch: (path, body) => call('patch', path, body),
  delete: (path) => call('delete', path),
}
