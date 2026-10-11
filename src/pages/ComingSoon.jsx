import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import './ComingSoon.css'

export default function ComingSoon({ title }) {
  const { bookId } = useParams()
  const displayTitle = title || (bookId ? `Book ${bookId}` : 'This Page')

  return (
    <div className="cs-page">
      <div className="cs-orb cs-orb--purple" />
      <div className="cs-orb cs-orb--gold" />

      <div className="cs-content">
        <div className="cs-badge">Coming Soon</div>

        <h1 className="cs-title">{displayTitle}</h1>

        <p className="cs-desc">
          We're working on something special. This content will be available soon — stay tuned.
        </p>

        <div className="cs-divider" />

        <Link to={bookId ? '/books' : '/'} className="cs-back">
          <FaArrowLeft /> {bookId ? 'Back to Books' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}
