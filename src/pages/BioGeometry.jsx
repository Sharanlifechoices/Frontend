import FAQ from '../components/FAQ'
import { TbGeometry } from 'react-icons/tb'
import './ServicePage.css'
import './BioGeometry.css'

const painPoints = [
  'Do you often feel mentally exhausted even after a full night\'s sleep?',
  'Struggle to focus at work despite your best efforts?',
  'Notice tension and miscommunication at home that seems to come out of nowhere?',
]

const faqItems = [
  { q: 'What exactly is BioGeometry?',          a: 'BioGeometry is the science of using geometric shapes, proportions and angles to harmonize energy fields in your environment. It was developed by Dr. Ibrahim Karim and is used worldwide.' },
  { q: 'How does it counter EMF and 5G effects?', a: 'BioGeometry shapes introduce a balancing energy quality that counteracts the stress caused by electromagnetic radiation from Wi-Fi routers, phones and 5G towers — without blocking the signals themselves.' },
  { q: 'Will I notice a difference quickly?',   a: 'Most clients report noticeable improvements within days — better sleep, clearer thinking, fewer arguments at home and reduced physical tension.' },
  { q: 'Do you need to visit my home or office?', a: 'Ideally yes, for the most accurate placement. However, remote consultations are available where I guide you through the process using floor plans and photos.' },
  { q: 'Is this related to Feng Shui?',         a: 'While there are overlapping principles around environmental energy, BioGeometry is a distinct science based on geometric shapes and measurable energy qualities rather than traditional Feng Shui elements.' },
  { q: 'How long does a BioGeometry session take?', a: 'An initial consultation runs about 90 minutes. Follow-up adjustments and checks are typically shorter.' },
]

export default function BioGeometry() {
  return (
    <div className="bio-page">

      {/* Hero */}
      <section className="page-hero" style={{ position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609391/site/backgrounds/bg5.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Galaxy core behind icon */}
        <div style={{
          position: 'absolute',
          width: 500, height: 500,
          top: '50%', left: '50%',
          marginTop: -250, marginLeft: -250,
          background: 'radial-gradient(ellipse, rgba(123,47,242,0.18) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
          borderRadius: '50%',
        }} />

        {/* Rotating sacred geometry rings */}
        <div className="geo-ring" style={{ width: 280, height: 280, borderColor: 'rgba(123,47,242,0.25)', '--dur': '28s', '--dir': 'normal'  }} />
        <div className="geo-ring" style={{ width: 380, height: 380, borderColor: 'rgba(6,182,212,0.18)',  '--dur': '40s', '--dir': 'reverse' }} />
        <div className="geo-ring" style={{ width: 480, height: 480, borderColor: 'rgba(212,168,83,0.12)', '--dur': '55s', '--dir': 'normal', borderStyle: 'dashed' }} />

        {/* Rotating hex SVG */}
        <svg style={{ position: 'absolute', width: 320, height: 320, top: '50%', left: '50%', marginTop: -160, marginLeft: -160, animation: 'ring-spin 35s linear infinite', opacity: 0.1 }} viewBox="0 0 100 100">
          <polygon points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"    fill="none" stroke="rgba(180,200,255,1)" strokeWidth="0.6" />
          <polygon points="50,18 79,34.5 79,65.5 50,82 21,65.5 21,34.5" fill="none" stroke="rgba(180,200,255,1)" strokeWidth="0.4" />
          <polygon points="50,28 71,39 71,61 50,72 29,61 29,39"          fill="none" stroke="rgba(180,200,255,1)" strokeWidth="0.3" />
        </svg>

        <div className="container hero-content bio-hero-inner">
          <h1 className="fade-in">
            <span className="gradient-text">BioGeometry</span>
          </h1>
          <p className="fade-in fade-in-delay-1">
            Harmonize your environment using the science of shape and energy.
          </p>
        </div>
      </section>

      {/* Pain points — 3 horizontal cards */}
      <section style={{ padding: '80px 0 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">Feeling Drained, Unfocused, or <span className="gradient-text">On-Edge</span> at Home or Work?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px' }}>
            {painPoints.map((point, i) => (
              <div key={i} className="card" style={{ padding: '32px 28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: 'var(--accent-gold)',
                  border: '1px solid rgba(212,168,83,0.3)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  {`0${i + 1}`}
                </span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '80px 0 100px', background: 'rgba(8,8,24,0.60)', marginTop: '80px' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>BioGeometry</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left' }}>
              Your Environment Shapes <span className="gradient-text">How You Feel</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                You're not alone. Many high-functioning professionals and homeowners face these exact
                frustrations — and often, the real cause isn't you, it's your environment.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                BioGeometry offers a simple, science-based way to restore balance to the spaces you
                live and work in — without needing to overhaul your lifestyle. It works by using
                precise geometric shapes to harmonize the subtle energy fields in your environment,
                helping your body return to its natural state of calm, clarity and vitality.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Originally developed by <a href="https://youtu.be/J3RlmAu3Rbs?si=PjKY_3MrqWdMm8-r" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-purple-light)', textDecoration: 'underline' }}>Dr. Ibrahim Karim</a> (My Guru).
                BioGeometry has been successfully applied in homes, offices, schools and even entire towns. These shapes interact with the electromagnetic and geopathic stresses around us—like Wi-Fi, 5G, and underground disturbances—to neutralize their effects on your nervous system.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Most clients report noticeable improvements within days — better sleep, clearer
                thinking, fewer arguments at home, more focus at work and even reduced physical
                tension. It's subtle, non-invasive and blends seamlessly into any lifestyle.
              </p>
              <blockquote style={{
                borderLeft: '3px solid var(--accent-gold)',
                paddingLeft: 24,
                margin: '8px 0',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 500,
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}>
                BioGeometry doesn't ask you to change who you are. It simply changes the energetic
                environment around you, so you can be more of your best self.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />

    </div>
  )
}
