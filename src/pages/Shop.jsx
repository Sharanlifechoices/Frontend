import { useState } from 'react'
import { buildShopItems } from '../data/shopItems'
import { useCart } from '../context/cart-context'
import ProductCard from '../components/commerce/ProductCard'
import './ServicePage.css'
import '../components/commerce/Commerce.css'

const shopItems = buildShopItems() // static display data, built once

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'book', label: 'Books' },
  { id: 'course', label: 'Courses' },
]

export default function Shop() {
  const { catalog } = useCart()
  const [filter, setFilter] = useState('all')
  const visible = shopItems.filter((p) => filter === 'all' || p.kind === filter)
  const groups = [
    { kind: 'book', title: 'Books', wide: false },
    { kind: 'course', title: 'Courses', wide: true },
  ]

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

          {groups.map(({ kind, title, wide }) => {
            const list = visible.filter((p) => p.kind === kind)
            if (list.length === 0) return null
            return (
              <div key={kind} className="shop-group">
                <h2 className="shop-group-title">{title}</h2>
                <div className={`books-grid${wide ? ' courses-grid' : ''}`}>
                  {list.map((p) => (
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
            )
          })}
        </div>
      </section>
    </>
  )
}
