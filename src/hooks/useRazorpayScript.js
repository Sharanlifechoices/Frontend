import { useState, useEffect } from 'react'

export function useRazorpayScript() {
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.Razorpay)

  useEffect(() => {
    if (ready) return

    const existing = document.getElementById('razorpay-script')
    if (existing) {
      if (window.Razorpay) { setReady(true); return }
      existing.addEventListener('load', () => setReady(true))
      return
    }

    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [ready])

  return ready
}
