import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useScrollLock } from '../hooks/useScrollLock'
import './Gallery.css'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useScrollLock(!!lightbox)

  useEffect(() => {
    getDocs(query(collection(db, 'gallery'), orderBy('createdAt', 'desc')))
      .then(snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="page-hero gallery-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609382/site/backgrounds/bg1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <span className="section-label">Visual Journey</span>
          <h1>Gallery</h1>
          <p className="page-hero-sub">Moments, sessions &amp; transformations captured along the way.</p>
        </div>
      </section>

      <section className="gallery-section" style={{ background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          {loading ? (
            <div className="gallery-loading">
              {[...Array(6)].map((_, i) => <div key={i} className="gallery-skeleton" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="gallery-empty">
              <p>No images yet — check back soon.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {items.map(g => (
                <div
                  key={g.id}
                  className="gallery-card"
                  onClick={() => setLightbox(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setLightbox(g)}
                >
                  <img src={g.url} alt={g.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-card-overlay">
                    <span className="gallery-card-title">{g.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
