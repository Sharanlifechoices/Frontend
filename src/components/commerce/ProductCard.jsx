import { Link } from 'react-router-dom'
import { formatMoney } from '../../lib/money'
import AddToCartButton from './AddToCartButton'
import './Commerce.css'

/**
 * One shop card for a book or a course: cover, title, price, View + Add to cart.
 * `item` is the server catalog entry (price, id); while it is missing the button is disabled,
 * and `comingSoon` cards have no price and no buy button.
 */
export default function ProductCard({ to, cover, label, title, subtitle, item, comingSoon = false, wide = false }) {
  return (
    <article className="book-card">
      <Link to={to} className={`book-card-cover${wide ? ' book-card-cover--wide' : ''}`} aria-label={subtitle ? `${title} — ${subtitle}` : title}>
        <img src={cover} alt="" loading="lazy" />
        {comingSoon && <span className="book-card-badge">Coming soon</span>}
      </Link>
      <div className="book-card-body">
        {label && <span className="book-card-label">{label}</span>}
        <h3>{title}</h3>
        {subtitle && <p className="book-card-sub">{subtitle}</p>}
        <p className="book-card-price">{item && !comingSoon ? formatMoney(item.price_minor, item.currency) : ' '}</p>
        <div className="book-card-actions">
          {comingSoon ? (
            <button type="button" className="btn-outline cm-btn" disabled><span>Coming soon</span></button>
          ) : (
            <>
              <Link to={to} className="btn-outline cm-btn"><span>View</span></Link>
              {item ? <AddToCartButton item={item} /> : <button type="button" className="btn-outline cm-btn" disabled><span>Loading…</span></button>}
            </>
          )}
        </div>
      </div>
    </article>
  )
}
