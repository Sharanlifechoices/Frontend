import { books } from '../../data/booksData'
import { useCart } from '../../context/cart-context'
import { catalogIdFor } from '../../lib/catalog'
import ProductCard from './ProductCard'
import './Commerce.css'

const karmicBooks = books.filter((b) => typeof b.id === 'number')
const moreBooks = books.filter((b) => typeof b.id !== 'number')

function Group({ list, catalog }) {
  return (
    <div className="books-grid">
      {list.map((book) => (
        <ProductCard
          key={book.id}
          to={`/books/${book.id}`}
          cover={book.cover}
          label={book.numberLabel}
          title={book.title}
          subtitle={book.subtitle}
          item={catalog?.byId[catalogIdFor(book)]}
          comingSoon={!book.description}
        />
      ))}
    </div>
  )
}

/** Every book as a card (cover, title, price, add to cart). Prices come from the server catalog. */
export default function BooksGrid() {
  const { catalog } = useCart()

  return (
    <section className="books-grid-section">
      <div className="container">
        <div className="cm-section-head">
          <span className="section-label">The Collection</span>
          <h2>All <span className="gradient-text">Books</span></h2>
          <p>Nine karmic-number books, one for every birthday, plus more guides from Sharan. Add as many as you like to your cart.</p>
        </div>

        <Group list={karmicBooks} catalog={catalog} />

        <div className="cm-section-head cm-section-head--sub">
          <span className="section-label">More from Sharan</span>
          <h2>The Old Fart’s <span className="gradient-text">Guides</span></h2>
        </div>

        <Group list={moreBooks} catalog={catalog} />
      </div>
    </section>
  )
}
