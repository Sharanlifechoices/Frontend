import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { books } from '../data/booksData'
import { useCart } from '../context/cart-context'
import { formatMoney } from '../lib/money'
import AddToCartButton from '../components/commerce/AddToCartButton'
import ComingSoon from './ComingSoon'
import './BookDetail.css'
import '../components/commerce/Commerce.css'

export default function BookDetail() {
  const { bookId } = useParams()
  const { catalog } = useCart()
  const book = books.find(b => b.id === Number(bookId))

  if (!book || !book.description) return <ComingSoon />

  // The price and the purchase itself always come from the server catalog, never from this file.
  const item = catalog?.byId[`book-${book.id}`]

  return (
    <div className="book-detail-page">
      <div className="bd-orb bd-orb--purple" />
      <div className="bd-orb bd-orb--gold" />

      <div className="container bd-content">
        <Link to="/books" className="bd-back">
          <FaArrowLeft /> Back to Books
        </Link>

        <div className="bd-hero">
          <div className="bd-cover-wrap">
            <img src={book.cover} alt={`${book.title} — ${book.subtitle}`} className="bd-cover" />
          </div>

          <div className="bd-info">
            <span className="section-label">{book.numberLabel}</span>
            <p className="bd-welcome">{book.welcome}</p>
            <h1 className="bd-title">
              {book.title} — <span className="gradient-text">{book.subtitle}</span>
            </h1>
            <p className="bd-description">{book.description}</p>

            <div className="bd-buy">
              <span className="bd-price">{item ? formatMoney(item.price_minor, item.currency) : ' '}</span>
              {item ? (
                <div className="bd-buy-actions">
                  <AddToCartButton item={item} buyNow label="Buy now" />
                  <AddToCartButton item={item} variant="outline" />
                </div>
              ) : (
                <p className="cm-muted">Loading price…</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
