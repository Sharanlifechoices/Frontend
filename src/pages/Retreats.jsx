import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import './ServicePage.css'
import './Gallery.css'

export default function Retreats() {
  const [images, setImages] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    api.get('/gallery?type=retreat', { auth: false })
      .then(({ items }) => setImages(items))
      .catch(() => {})
  }, [])

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.3), rgba(5,5,20,0.3)), url("https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609883/site/backgrounds/rishikesh.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container hero-content">
          <h1 className="fade-in">
            <span className="gradient-text">Reset Your Life</span>
          </h1>
          <p className="fade-in fade-in-delay-1">
            A 10-day immersive yoga and life clarity retreat in Rishikesh, India.
          </p>
          <p className="fade-in fade-in-delay-2" style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
            Intake limited<br />
            Retreat Date: June, July, August 2026<br />
            2nd Friday of every month — Call for dates.
          </p>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>Retreat</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left' }}>
              Rishikesh Changed My <span className="gradient-text">Life</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                For years, my life moved in many directions at once. Outwardly functional, inwardly
                unsettled. I carried persistent questions about purpose, meaning and direction that
                success alone could not answer.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                That search led me to Rishikesh in 2017. I undertook a 10-day immersive yoga course
                and the experience brought a level of clarity, grounding and inner alignment I had
                not encountered before.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                It was not emotional. It was precise. Something fundamental recalibrated.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Since then, my study has gone far deeper and more disciplined. I immersed myself in
                classical yoga and breathwork and practice numerology at an advanced
                level. These disciplines were not studied in isolation but tested through lived
                practice and integration.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Today, I work with people from around the world to help them live with greater
                awareness, presence and inner freedom.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Drawing from this body of work and years of direct experience, I have worked closely
                with the team at Maharishi Yoga Peeth to design this specialised 10-day on-site
                retreat in Rishikesh as a deliberate confluence of ancient yogic disciplines and
                contemporary interpretive tools.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                The programme is structured to help participants not only experience inner alignment
                but understand how to apply it with clarity and stability in daily modern living.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                My aim for everyone participating in this retreat is to leave grounded, clear and
                equipped with practices and understanding they can carry forward long after returning home.
              </p>
              <div style={{ marginTop: 32 }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: 16 }}>Choose Your Accommodation</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                  <div className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 10 }}>Twin Share</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f0cc73', margin: 0, lineHeight: 1.1 }}>$1,296</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6 }}>USD per person</p>
                  </div>
                  <div className="card" style={{ padding: '28px 24px', textAlign: 'center', border: '1px solid rgba(212,168,83,0.4)' }}>
                    <p style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 10 }}>Private Room</p>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f0cc73', margin: 0, lineHeight: 1.1 }}>$1,496</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 6 }}>USD per person</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <a href="/Retreat.pdf" download className="btn-primary" style={{ textDecoration: 'none' }}>
                  <span>Download Brochure</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {images.length > 0 && (
        <section className="gallery-section" style={{ background: 'rgba(5,5,20,0.35)' }}>
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center' }}>Retreat</p>
            <h2 className="section-title">Moments from <span className="gold-text">Rishikesh</span></h2>
            <div className="gallery-grid" style={{ marginTop: 48 }}>
              {images.map(img => (
                <div
                  key={img.id}
                  className="gallery-card"
                  onClick={() => setLightbox(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setLightbox(img)}
                >
                  <img src={img.url} alt={img.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-card-overlay">
                    <span className="gallery-card-title">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <div className="gallery-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.url} alt={lightbox.title} className="gallery-lightbox-img" />
            <p className="gallery-lightbox-title">{lightbox.title}</p>
          </div>
        </div>
      )}
    </>
  )
}
