import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { FaTimes } from 'react-icons/fa'
import { useScrollLock } from '../../hooks/useScrollLock'
import '../BookSession.css'
import './Commerce.css'

/** Shown when a guest adds something to the cart: sign in or sign up, and the cart is waiting afterwards. */
export default function AuthPrompt({ from = '/cart', onClose }) {
  useScrollLock(true)
  // Rendered on <body>: inside a card (which lifts on hover) a fixed overlay would be trapped in the card.
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content book-modal cm-center" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Sign in to continue">
        <button className="modal-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        <h3 className="book-title">Added to your cart</h3>
        <p className="book-subtitle">Sign in or create a free account to check out. Your cart is saved and will be waiting for you.</p>
        <div className="cm-actions">
          <Link to="/login" state={{ from }} className="btn-primary" onClick={onClose}><span>Sign in</span></Link>
          <Link to="/signup" state={{ from }} className="btn-outline" onClick={onClose}><span>Create account</span></Link>
        </div>
        <button type="button" className="cm-link" onClick={onClose}>Keep browsing</button>
      </div>
    </div>,
    document.body,
  )
}
