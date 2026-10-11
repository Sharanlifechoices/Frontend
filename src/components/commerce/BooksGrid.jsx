import { Link } from 'react-router-dom'
import { books } from '../../data/booksData'
import { useCart } from '../../context/cart-context'
import { formatMoney } from '../../lib/money'
import AddToCartButton from './AddToCartButton'
import './Commerce.css'

/** Every book as a card (cover, title, price, add to cart). Prices come from the server catalog. */
export default function BooksGrid() {
  const { catalog } = useCart()

  return (
    <section className="books-grid-section">
      <div className="container">
        <div className="cm-section-head">
          <span className="section-label">The Collection</span>
          <h2>All <span className="gradient-text">Books</span></h2>
          <p>Nine books, one for every karmic number. Add as many as you like to your cart.</p>
        </div>

        <div className="books-grid">
          {books.map((book) => {
            const item = catalog?.byId[`book-${book.id}`]
            const available = Boolean(book.description) && Boolean(item)
            return (
              <article className="book-card" key={book.id}>
                <Link to={`/books/${book.id}`} className="book-card-cover" aria-label={`${book.title} — ${book.subtitle}`}>
                  <img src={book.cover} alt="" loading="lazy" />
                  {!book.description && <span className="book-card-badge">Coming soon</span>}
                </Link>
                <div className="book-card-body">
                  <span className="book-card-label">{book.numberLabel}</span>
                  <h3>{book.title}</h3>
                  <p className="book-card-sub">{book.subtitle}</p>
                  <p className="book-card-price">{item ? formatMoney(item.price_minor, item.currency) : ' '}</p>
                  <div className="book-card-actions">
                    <Link to={`/books/${book.id}`} className="btn-outline cm-btn"><span>View</span></Link>
                    {available ? <AddToCartButton item={item} /> : <button type="button" className="btn-outline cm-btn" disabled><span>{book.description ? 'Loading…' : 'Coming soon'}</span></button>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
