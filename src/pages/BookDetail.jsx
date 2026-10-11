import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { books } from '../data/booksData'
import BuyNowButton from '../components/BuyNowButton'
import ComingSoon from './ComingSoon'
import './BookDetail.css'

export default function BookDetail() {
  const { bookId } = useParams()
  const book = books.find(b => b.id === Number(bookId))

  if (!book || !book.description) return <ComingSoon />

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
            <BuyNowButton book={book} />
          </div>
        </div>
      </div>
    </div>
  )
}
