import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/cart-context'
import AuthPrompt from './AuthPrompt'
import ScheduleModal from './ScheduleModal'
import './Commerce.css'

/**
 * Adds a catalog item to the cart.
 * - Sessions first ask for a preferred date and time.
 * - A guest is then asked to sign in or sign up; their cart is merged afterwards.
 * - `buyNow` goes straight to the cart (and checkout) after adding.
 */
export default function AddToCartButton({ item, label = 'Add to cart', buyNow = false, variant = 'primary' }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scheduling, setScheduling] = useState(false)
  const [prompt, setPrompt] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const add = async (schedule = {}) => {
    setBusy(true)
    setError('')
    try {
      const { guest } = await addItem(item.id, schedule)
      setScheduling(false)
      if (guest) setPrompt(true)
      else if (buyNow) navigate('/cart')
      else {
        setAdded(true)
        timer.current = setTimeout(() => setAdded(false), 4000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const click = () => (item.requires_schedule ? setScheduling(true) : add())

  return (
    <>
      {added ? (
        <Link to="/cart" className={`btn-${variant} cm-btn`}><span>Added ✓ View cart</span></Link>
      ) : (
        <button type="button" className={`btn-${variant} cm-btn`} onClick={click} disabled={busy}>
          <FaShoppingCart /> <span>{busy && !scheduling ? 'Adding…' : label}</span>
        </button>
      )}
      {error && !scheduling && <p className="cm-error" role="alert">{error}</p>}
      {scheduling && (
        <ScheduleModal
          title={item.title} confirmLabel={buyNow ? 'Continue to cart' : 'Add to cart'} busy={busy} error={error}
          onConfirm={add} onClose={() => { setScheduling(false); setError('') }}
        />
      )}
      {prompt && <AuthPrompt from={buyNow ? '/cart' : pathname} onClose={() => setPrompt(false)} />}
    </>
  )
}
