import { useState, useEffect } from 'react'
import { FaWhatsapp, FaTimes, FaCommentDots } from 'react-icons/fa'
import { WHATSAPP_NUMBER } from '../whatsapp'
import { useScrollLock } from '../hooks/useScrollLock'
import './ContactUs.css'

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', dob: '' })
  const [sent, setSent] = useState(false)

  useScrollLock(isOpen)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-contact', handler)
    return () => window.removeEventListener('open-contact', handler)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `*New Enquiry — My LifeChoices*\n\n👤 Name: ${form.name}\n📧 Email: ${form.email}\n🎂 Date of Birth: ${form.dob}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setIsOpen(false)
      setForm({ name: '', email: '', dob: '' })
    }, 2000)
  }

  return (
    <>
      <button className="contact-fab" onClick={() => setIsOpen(true)} aria-label="Contact us">
        <FaCommentDots className="contact-fab-icon" />
        <span>Contact Us</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>

            {sent ? (
              <div className="contact-success">
                <FaWhatsapp className="success-wa-icon" />
                <h3>Opening WhatsApp…</h3>
                <p>Your message is ready to send to Sharan.</p>
              </div>
            ) : (
              <>
                <div className="contact-modal-header">
                  <FaWhatsapp className="modal-wa-icon" />
                  <h3 className="contact-title">Get in Touch</h3>
                  <p className="contact-subtitle">We'll connect with you on WhatsApp</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email ID</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="contact-submit">
                    <FaWhatsapp /> Send on WhatsApp
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
