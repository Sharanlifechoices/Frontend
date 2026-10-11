import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db } from '../firebase'
import { RZP_KEY } from '../constants/razorpay'
import { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PURCHASE_TEMPLATE_ID, BOOKING_URL } from '../constants/emailjs'
import { WHATSAPP_THANKYOU_ENDPOINT, WHATSAPP_THANKYOU_CLIENT_TOKEN } from '../constants/whatsappCloud'
import { useRazorpayScript } from '../hooks/useRazorpayScript'
import { useScrollLock } from '../hooks/useScrollLock'
import './BuyNowButton.css'

// Initialize once at module load — required in @emailjs/browser v4+; without this
// the send() call can silently fail on some v4.x code paths even with a key passed as 4th arg
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })

const today = new Date().toISOString().split('T')[0]

export default function BuyNowButton({ book }) {
  const ready = useRazorpayScript()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dob: '' })
  const [dobError, setDobError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [purchased, setPurchased] = useState(false)

  useScrollLock(isFormOpen)

  const openCheckout = () => {
    if (!ready || !window.Razorpay || processing) return
    setProcessing(true)

    const options = {
      key: RZP_KEY,
      amount: book.price,
      currency: book.currency,
      name: 'My LifeChoices',
      description: `${book.title} — ${book.subtitle}`,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#7b2ff2' },
      handler: async (response) => {
        let orderRef = null
        try {
          const writePromise = addDoc(collection(db, 'bookOrders'), {
            bookId: book.id,
            bookTitle: `${book.title} — ${book.subtitle}`,
            amount: book.price,
            currency: book.currency,
            paymentId: response.razorpay_payment_id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            createdAt: new Date().toISOString(),
          })
          orderRef = await Promise.race([
            writePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000)),
          ])
        } catch (err) {
          console.error('Firestore error after book payment:', err)
        }
        let emailSentOk = false
        let emailErr = ''
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_PURCHASE_TEMPLATE_ID, {
            to_email: formData.email,
            to_name: formData.name,
            book_title: `${book.title} — ${book.subtitle}`,
            pdf_link: book.pdfUrl,
            booking_link: BOOKING_URL,
          }, { publicKey: EMAILJS_PUBLIC_KEY })
          emailSentOk = true
        } catch (err) {
          console.error('EmailJS error after book payment:', err)
          emailErr = err?.text || err?.message || String(err)
        }
        if (orderRef) {
          updateDoc(orderRef, emailSentOk
            ? { emailSent: true, emailSentAt: serverTimestamp() }
            : { emailSent: false, emailError: emailErr }
          ).catch(() => {})
        }
        try {
          await fetch(WHATSAPP_THANKYOU_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shared-Secret': WHATSAPP_THANKYOU_CLIENT_TOKEN,
            },
            body: JSON.stringify({
              phone: formData.phone,
              name: formData.name,
              paymentId: response.razorpay_payment_id,
              pdfLink: book.pdfUrl,
            }),
          })
        } catch (err) {
          console.error('WhatsApp thank-you error after book payment:', err)
        }
        setProcessing(false)
        setPurchased(true)
      },
      modal: {
        ondismiss: () => setProcessing(false),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      console.error('Book payment failed:', response.error)
      alert('Payment failed: ' + (response.error?.description || 'Please try again.'))
      setProcessing(false)
    })
    rzp.open()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dobDate = new Date(formData.dob)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (dobDate > now) {
      setDobError('Date of birth cannot be in the future.')
      return
    }
    if (dobDate.getFullYear() < 1900) {
      setDobError('Please enter a valid date of birth after 1900.')
      return
    }
    setDobError('')
    setIsFormOpen(false)
    openCheckout()
  }

  if (purchased) {
    return (
      <div className="buy-now-success">
        <span className="buy-now-success-icon">&#10003;</span>
        <p>Payment received! We'll email your copy of the book and a thank-you note shortly.</p>
      </div>
    )
  }

  return (
    <>
      <button className="buy-now-btn" onClick={() => setIsFormOpen(true)} disabled={!ready || processing}>
        {!ready ? 'Loading payment…' : processing ? 'Opening Payment…' : `Buy Now — ${book.currency} ${(book.price / 100).toFixed(2)}`}
      </button>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsFormOpen(false)}>
              <FaTimes />
            </button>

            <h3 className="book-title">Buy This Book</h3>
            <p className="book-subtitle">A few details before checkout</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Mobile No.</label>
                <input type="tel" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+65 xxxx xxxx" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" required max={today} value={formData.dob}
                  onChange={(e) => { setFormData({ ...formData, dob: e.target.value }); setDobError('') }} />
                {dobError && <p style={{ marginTop: 8, color: '#f87171', fontSize: '0.82rem' }}>{dobError}</p>}
              </div>
              <button type="submit" className="btn-primary book-submit">
                <span>Continue to Payment</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
