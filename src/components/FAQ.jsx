import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import ContactForm from './ContactForm'
import './FAQ.css'

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [showContact, setShowContact] = useState(false)

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
        <p className="section-subtitle">Everything you need to know</p>

        <div className="faq-list">
          {items.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <FiChevronDown className="faq-arrow" />
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>Still confused?</p>
          <button className="btn-primary" onClick={() => setShowContact(true)}>
            <span>Contact Us</span>
          </button>
        </div>
      </div>

      {showContact && <ContactForm onClose={() => setShowContact(false)} />}
    </section>
  )
}
