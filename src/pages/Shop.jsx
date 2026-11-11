import { useState } from 'react'
import { buildShopItems } from '../data/shopItems'
import { useCart } from '../context/cart-context'
import ProductCard from '../components/commerce/ProductCard'
import './ServicePage.css'
import '../components/commerce/Commerce.css'

const shopItems = buildShopItems() // static display data, built once

// Shop shelves, in page order: how many columns each uses and whether cards keep a wide set cover.
const SHELVES = [
  { shelf: 'books', title: 'Books', cols: 3, wide: false },
  { shelf: 'courses', title: 'Courses', cols: 2, wide: true },
  { shelf: 'masters', title: 'Tantra & Tarot', cols: 2, wide: true },
  { shelf: 'oldfarts', title: 'The Old Fart’s Guides', cols: 3, wide: true },
]

const FILTERS = [
  { id: 'all', label: 'All', shelves: SHELVES.map((s) => s.shelf) },
  { id: 'books', label: 'Books', shelves: ['books'] },
  { id: 'courses', label: 'Courses', shelves: ['courses', 'masters'] },
  { id: 'oldfarts', label: 'Old Fart’s Guides', shelves: ['oldfarts'] },
]

export default function Shop() {
  const { catalog } = useCart()
  const [filter, setFilter] = useState('all')
  const active = FILTERS.find((f) => f.id === filter)

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609382/site/backgrounds/bg1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container hero-content">
          <span className="section-label">Sharan’s Shop</span>
          <h1 className="fade-in"><span className="gradient-text">Books &amp; Courses</span></h1>
          <p className="fade-in fade-in-delay-1">Every book and course from Sharan Babaji, in one place.</p>
        </div>
      </section>

      <section className="books-grid-section">
        <div className="container">
          <div className="shop-filters" role="group" aria-label="Filter products">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`shop-chip${filter === f.id ? ' active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {SHELVES.filter((g) => active.shelves.includes(g.shelf)).map(({ shelf, title, cols, wide }) => (
            <div key={shelf} className="shop-group">
              <h2 className="shop-group-title">{title}</h2>
              <div className={`books-grid books-grid--${cols}`}>
                {shopItems.filter((p) => p.shelf === shelf).map((p) => (
                  <ProductCard
                    key={p.key}
                    wide={wide}
                    to={p.to}
                    cover={p.cover}
                    label={p.label}
                    title={p.title}
                    subtitle={p.subtitle}
                    item={catalog?.byId[p.catalogId]}
                    comingSoon={p.comingSoon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
