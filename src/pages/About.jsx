import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { TbNumbers, TbGeometry, TbYoga, TbEye, TbWorld } from 'react-icons/tb'
import './ServicePage.css'

const sessionHelps = [
  { icon: <TbNumbers />, num: '01', text: 'Make aligned career and business decisions' },
  { icon: <TbWorld />,   num: '02', text: 'Understand relationship dynamics and compatibility' },
  { icon: <TbEye />,     num: '03', text: 'Find purpose, direction and clarity through numbers' },
  { icon: <TbGeometry />,num: '04', text: 'Balance the energy in their home, office or restaurant' },
  { icon: <TbYoga />,    num: '05', text: 'Release emotional heaviness through breath and mantra meditation' },
]

export default function About() {
  return (
    <>
      {/* Hero Image */}
      <section className="about-hero-image">
        <div className="container">
          <div className="about-img-wrap">
            <img
              src="https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_900,c_limit/v1781609493/site/about/sharan.jpg"
              alt="Sharan — Master LifeChoice Analyst"
              className="about-portrait"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* About Sharan */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>About</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left' }}>
              Meet <span className="gold-text">Sharan</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Sharan is a holistic guide and certified practitioner of Chinese and Vedic numerology
                as well as Egyptian and Yogic sciences of frequency and healing. He helps individuals
                and business owners navigate critical life decisions with clarity and confidence using
                ancient wisdom, practical insights and precision-based tools.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Having trained under Master Teachers across India and beyond. Sharan integrates his
                life experience, research mindset, military discipline and energetic mastery to help
                people restore balance, find purpose and unlock real-world results. From business
                owners, homeowners and high-performing professionals to parents seeking guidance for
                their children. Sharan's sessions are known to bring peace, direction and inner alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From Warrior to Analyst */}
      <section style={{ padding: '100px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>His Journey</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left' }}>
              From <span className="gradient-text">Warrior</span> to Analyst
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                I've walked a path most would never imagine — first as a military officer, an elite
                operations specialist and now as a guide, helping people unlock their clarity and
                purpose through ancient wisdom and modern energy work.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                I've led men, navigated high-stakes assignments, trained in intelligence, terrain,
                team efforts, timing and strategy. Experienced over a decade-long career in personal
                protection as well as a prudent master in close-combat readiness, a big brother to all.
                However, years of intensity, sacrifice and discipline led to a pivotal question:{' '}
                <em style={{ color: 'var(--accent-gold)' }}>What now?</em>
              </p>

              {/* Pull quote */}
              <blockquote style={{
                borderLeft: '3px solid var(--accent-gold)',
                paddingLeft: 24,
                margin: '8px 0',
                color: 'var(--text-primary)',
                fontSize: '1.15rem',
                fontWeight: 500,
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}>
                That question became a turning point.
              </blockquote>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                I shifted my focus inward — away from outer battlefields downrange, to the inner
                landscape of consciousness. What began as a self-healing journey turned into a
                lifelong calling.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                I immersed myself in advanced Yogic studies across India, certified in Yoga Teacher
                Training (TTC 500), Vedic breathwork, Ayurveda and Siddha practices.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                I also studied Advanced Vedic and Chinese Numerology, developing my own powerful
                LifeChoice Analytics™ system — a Human Profiling tool to decode an individual's life
                blueprint for greater insight, success, harmony and clarity.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                With the deep understanding and teachings I received, I felt the need to help others
                by blending the best of each practice into simple and life-changing practices that
                anyone can relate to and get relief from.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Today, I blend my intuition with analysis, mysticism with strategy and ancient
                sciences with grounded results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Sessions Help */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">How Sessions <span className="gold-text">Help</span></h2>
          <p className="section-subtitle">Practical guidance across every area of life</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px' }}>
            {sessionHelps.map((item, i) => (
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
                  {item.num}
                </span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section style={{ padding: '80px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--accent-gold)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', lineHeight: 1.8, marginBottom: 24 }}>
              "Clarity isn't a luxury — it's your birthright."
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem' }}>
              Whether you're a parent, professional, student or seeker — my mission is simple:
              to guide you back to your core. Not by predicting your future but by helping you
              create it — with precision, confidence and peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta" style={{ position: 'relative', zIndex: 1, background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Begin Your <span className="gradient-text">Journey</span>?</h2>
            <p>Take the first step toward clarity, purpose and inner peace.</p>
            <Link to="/numerology" className="btn-primary">
              <span>Explore Numerology</span> <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
