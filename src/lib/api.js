// Thin fetch wrapper for the My LifeChoices API.
// - Access token lives in memory only; the refresh token is kept in localStorage.
// - A 401 triggers one silent refresh (single-flight) and a retry of the original request.
// - Every request/response is logged to the console in dev (secrets redacted) with the server request id.

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')
const REFRESH_KEY = 'lc_refresh_token'
const DEV = import.meta.env.DEV

let accessToken = null
let refreshing = null
let onSessionLost = () => {}

const store = {
  get() {
    try { return localStorage.getItem(REFRESH_KEY) } catch { return null }
  },
  set(value) {
    try { value ? localStorage.setItem(REFRESH_KEY, value) : localStorage.removeItem(REFRESH_KEY) } catch { /* private mode */ }
  },
}

export class ApiError extends Error {
  constructor(status, detail, requestId) {
    super(ApiError.messageFrom(status, detail))
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.requestId = requestId
  }

  static messageFrom(status, detail) {
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length) return detail[0].msg || 'Please check the form and try again.'
    if (detail && typeof detail === 'object' && detail.message) return detail.message
    return status ? `Something went wrong (${status}). Please try again.` : 'Could not reach the server. Check your connection and try again.'
  }

  /** { fieldName: message } built from FastAPI validation errors. */
  get fieldErrors() {
    if (!Array.isArray(this.detail)) return {}
    return Object.fromEntries(this.detail.filter((e) => e.loc).map((e) => [e.loc[e.loc.length - 1], e.msg]))
  }
}

const SENSITIVE = /password|token|secret|authorization|signature|otp|^code$/i
function redact(value) {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, SENSITIVE.test(k) ? '***' : redact(v)]))
  }
  return value
}

function log(method, path, started, status, requestBody, responseBody, requestId) {
  if (!DEV) return
  const ms = Math.round(performance.now() - started)
  console.groupCollapsed(`[api] ${method} ${path} -> ${status ?? 'network error'} (${ms}ms)${requestId ? ` #${requestId}` : ''}`)
  if (requestBody !== undefined) console.log('request', redact(requestBody))
  console.log('response', redact(responseBody))
  console.groupEnd()
}

async function parse(res) {
  if (res.status === 204) return null
  const type = res.headers.get('content-type') || ''
  return type.includes('application/json') ? res.json() : res.text()
}

async function send(method, path, body, auth) {
  const started = performance.now()
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`
  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined })
  } catch {
    log(method, path, started, null, body, 'network error')
    throw new ApiError(0, null)
  }
  const requestId = res.headers.get('X-Request-ID')
  const data = await parse(res).catch(() => null)
  log(method, path, started, res.status, body, data, requestId)
  if (!res.ok) throw new ApiError(res.status, data && data.detail !== undefined ? data.detail : data, requestId)
  return data
}

function refreshSession() {
  if (refreshing) return refreshing
  const token = store.get()
  if (!token) return Promise.resolve(false)
  refreshing = send('POST', '/auth/refresh', { refresh_token: token }, false)
    .then((tokens) => {
      session.setTokens(tokens)
      return true
    })
    .catch((err) => {
      // Only a rejected token ends the session; a flaky network keeps it for the next try.
      if (err.status === 401 || err.status === 422) session.clear()
      return false
    })
    .finally(() => { refreshing = null })
  return refreshing
}

async function request(method, path, body, { auth = true } = {}) {
  try {
    return await send(method, path, body, auth)
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401 || !auth || !store.get()) throw err
    if (!(await refreshSession())) {
      onSessionLost()
      throw err
    }
    return send(method, path, body, auth)
  }
}

export const session = {
  setTokens({ access_token: access, refresh_token: refresh }) {
    accessToken = access
    if (refresh) store.set(refresh)
  },
  clear() {
    accessToken = null
    store.set(null)
  },
  hasRefreshToken: () => Boolean(store.get()),
  /** Try to turn a stored refresh token into an access token. Resolves true if signed in. */
  restore: refreshSession,
  onLost(fn) { onSessionLost = fn },
}

export const api = {
  get: (path, opts) => request('GET', path, undefined, opts),
  post: (path, body, opts) => request('POST', path, body ?? {}, opts),
  put: (path, body, opts) => request('PUT', path, body ?? {}, opts),
  patch: (path, body, opts) => request('PATCH', path, body ?? {}, opts),
  delete: (path, opts) => request('DELETE', path, undefined, opts),
}
