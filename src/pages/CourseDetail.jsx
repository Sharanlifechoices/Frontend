import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaBookOpen } from 'react-icons/fa'
import { courses } from '../data/coursesData'
import { useCart } from '../context/cart-context'
import { catalogIdFor } from '../lib/catalog'
import { formatMoney } from '../lib/money'
import AddToCartButton from '../components/commerce/AddToCartButton'
import ComingSoon from './ComingSoon'
import './BookDetail.css'
import '../components/commerce/Commerce.css'

export default function CourseDetail() {
  const { courseSlug } = useParams()
  const { catalog } = useCart()
  const course = courses.find((c) => c.slug === courseSlug)

  if (!course) return <ComingSoon />

  // The price and the purchase itself always come from the server catalog, never from this file.
  const item = catalog?.byId[catalogIdFor(course)]

  return (
    <div className="book-detail-page">
      <div className="bd-orb bd-orb--purple" />
      <div className="bd-orb bd-orb--gold" />

      <div className="container bd-content">
        <Link to="/retreats" className="bd-back">
          <FaArrowLeft /> Back to Courses
        </Link>

        <div className="bd-hero bd-hero--wide">
          <div className="bd-cover-wrap">
            <img src={course.cover} alt={`${course.title} — ${course.subtitle}`} className="bd-cover bd-cover--wide" />
          </div>

          <div className="bd-info">
            <span className="section-label">{course.label}</span>
            <p className="bd-welcome">{course.tagline}</p>
            <h1 className="bd-title">
              {course.title} — <span className="gradient-text">{course.subtitle}</span>
            </h1>
            <p className="bd-description">{course.description}</p>

            <div className="cd-includes">
              <p className="cd-includes-title">What’s included: 3 books in one download</p>
              <ul>
                {course.includes.map((book) => (
                  <li key={book.title}>
                    <FaBookOpen aria-hidden="true" />
                    <span><strong>{book.title}</strong><small>{book.note}</small></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bd-buy">
              <span className="bd-price">{item ? formatMoney(item.price_minor, item.currency) : ' '}</span>
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
