import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import './ServicePage.css'

function reduceDigits(n) {
  return String(n).split('').reduce((a, c) => a + Number(c), 0)
}

function calcKarmic(dateStr) {
  // YYYY-MM-DD → strip dashes, sum all digits, reduce until single digit
  let sum = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + Number(c), 0)
  while (sum > 9) sum = reduceDigits(sum)
  return sum
}

function KarmicCalculator() {
  const [date, setDate] = useState('')
  const [karmic, setKarmic] = useState(null)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const calculate = () => {
    if (!date) return
    const chosen = new Date(date)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (chosen > now) {
      setError('Date of birth cannot be in the future.')
      setKarmic(null)
      return
    }
    if (chosen.getFullYear() < 1900) {
      setError('Please enter a valid date of birth after 1900.')
      setKarmic(null)
      return
    }
    setError('')
    setKarmic(calcKarmic(date))
  }

  return (
    <section style={{ padding: '80px 0 60px', background: 'rgba(5,5,20,0.35)' }}>
      <div className="container">
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">Find Your Book</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, marginBottom: 12, marginTop: 8 }}>
            Discover Your <span className="gradient-text">Karmic Number</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 36, lineHeight: 1.7 }}>
            Enter your date of birth — we'll reveal which of Sharan's books was written for you.
          </p>

          <div className="card" style={{ padding: '40px 36px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 12 }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={date}
              max={today}
              onChange={e => { setDate(e.target.value); setKarmic(null); setError('') }}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 12,
                border: '1px solid rgba(212,168,83,0.3)', background: 'rgba(212,168,83,0.06)',
                color: 'var(--text-primary)', fontSize: '1.05rem', outline: 'none',
                marginBottom: 20, fontFamily: 'var(--font-body)', colorScheme: 'dark',
              }}
            />
            <button
              onClick={calculate}
              disabled={!date}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 12, border: 'none',
                background: date ? 'linear-gradient(135deg, #d4a853, #f0cc73)' : 'rgba(212,168,83,0.2)',
                color: date ? '#050510' : 'var(--text-secondary)',
                fontSize: '0.95rem', fontWeight: 700, cursor: date ? 'pointer' : 'not-allowed',
                letterSpacing: '0.5px', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              Calculate My Karmic Number
            </button>

            {error && (
              <p style={{ marginTop: 14, color: '#f87171', fontSize: '0.85rem', lineHeight: 1.5 }}>{error}</p>
            )}

            {karmic !== null && (
              <div style={{ marginTop: 32, padding: '32px 24px', borderRadius: 16, background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.35)' }}>
                <p style={{ fontSize: '0.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-gold)', margin: '0 0 8px' }}>Your Karmic Number Is</p>
                <p style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)', fontWeight: 900, color: '#f0cc73', lineHeight: 1, margin: '0 0 16px' }}>{karmic}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.65 }}>
                  The universe has a book written just for you. Explore the blueprint of your life path.
                </p>
                <Link
                  to={`/books/${karmic}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '13px 28px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #d4a853, #f0cc73)',
                    color: '#050510', fontWeight: 700, fontSize: '0.92rem',
                    textDecoration: 'none', letterSpacing: '0.4px',
                  }}
                >
                  View Book {karmic} — Your Karmic Book <FaArrowRight />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Books() {
  return (
    <>
      <section style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609501/site/books/cover-banner.jpg")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat', minHeight: '100vh', width: '100%' }}>
      </section>

      <KarmicCalculator />
    </>
  )
}
