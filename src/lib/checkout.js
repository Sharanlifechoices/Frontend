// Razorpay checkout driven by the backend.
//
// The server creates the order and decides the price; the browser only opens the Razorpay window and
// then asks the server to verify the signature. The UI shows "paid" only after the server confirms it,
// and if the confirmation call is lost the Razorpay webhook still settles the order server-side.
import { api, ApiError } from './api'

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
let scriptPromise = null

export function loadRazorpay() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(window.Razorpay)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => resolve(window.Razorpay)
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Could not load the payment window. Check your connection and try again.'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

function openRazorpay(order) {
  return new Promise((resolve) => {
    let lastError = ''
    const rzp = new window.Razorpay({
      key: order.key_id,
      order_id: order.razorpay_order_id,
      amount: order.amount,
      currency: order.currency,
      name: 'My LifeChoices',
      prefill: order.prefill,
      theme: { color: '#7b2ff2' },
      handler: (response) => resolve({ outcome: 'success', payload: response }),
      modal: { ondismiss: () => resolve({ outcome: 'dismissed', error: lastError }) },
    })
    // Razorpay lets the customer retry inside the window, so a failure only matters if they then close it.
    rzp.on('payment.failed', (res) => { lastError = res.error?.description || '' })
    rzp.open()
  })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Ask the server to confirm the payment. Retries transient failures; returns null if it never got through. */
async function verifyWithRetry(payload) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await api.post('/checkout/verify', payload)
    } catch (err) {
      const definitive = err instanceof ApiError && err.status >= 400 && err.status < 500 && err.status !== 429
      if (definitive) {
        err.paymentId = payload.razorpay_payment_id
        throw err
      }
      if (attempt < 3) await sleep(1500 * (attempt + 1))
    }
  }
  return null
}

/**
 * Resolves to one of:
 *   { status: 'paid', order }      server confirmed the payment
 *   { status: 'pending' }          paid, but we could not reach the server; the webhook will settle it
 *   { status: 'dismissed', error } the customer closed the window without paying
 * Rejects with an ApiError if the order could not be created or the server rejected the payment.
 */
async function runCheckout(createOrder) {
  const [order] = await Promise.all([createOrder(), loadRazorpay()])
  const result = await openRazorpay(order)
  if (result.outcome === 'dismissed') return { status: 'dismissed', error: result.error }
  const verified = await verifyWithRetry(result.payload)
  return verified ? { status: 'paid', order: verified } : { status: 'pending' }
}

export const checkoutCart = () => runCheckout(() => api.post('/checkout'))
export const checkoutSession = (body) => runCheckout(() => api.post('/checkout/session', body))
