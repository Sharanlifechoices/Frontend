import { TbEye, TbBrain, TbFeather, TbBolt } from 'react-icons/tb'
import './ServicePage.css'

const experiencePoints = [
  { num: '01', text: 'A guided journey through all seven major Chakras from Muladhara (root) to Sahasrara (crown)' },
  { num: '02', text: 'Insights into how each Chakra influences your emotions, behavior and decision-making' },
  { num: '03', text: 'Discovery of where emotional patterns and physical tension live in your body' },
  { num: '04', text: 'Alignment strategies to bring your energy into balance using Yogic, meditation and numerical wisdom' },
  { num: '05', text: 'Integration of my custom numerology grid with Chakra archetypes for a more personalized roadmap' },
]

const clientLeaves = [
  { icon: <TbBrain />, title: 'Greater Emotional Clarity', desc: 'Understand the emotional patterns that have been running beneath the surface.' },
  { icon: <TbFeather />, title: 'A Deeper Sense of Inner Peace', desc: 'Leave each session with a tangible sense of calm and inner settledness.' },
  { icon: <TbBolt />, title: 'Practical Awareness of Personal Power', desc: 'Know how to activate your strengths and direct your energy in daily life.' },
]

export default function ChakraReading() {
  return (
    <>
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609389/site/backgrounds/bg4.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container hero-content">
          <h1 className="fade-in">
            Chakra <span className="gradient-text">Reading</span>
          </h1>
          <p className="fade-in fade-in-delay-1">
            Discover the blueprint to your emotional strength, inner balance, and personal power.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: '100px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>Chakra Reading</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left', lineHeight: 1.3 }}>
              What If Your Chakras Held the Blueprint to Your Emotional Strength,{' '}
              <span className="gradient-text">Inner Balance, and Personal Power?</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                As a chakra guide and initiated yogi, I combine the ancient wisdom of Indian tantra
                with a modern, structured approach to decode the energy centers that shape your life
                from within.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                This isn't just symbolic theory. It's a practical exploration of how your body,
                emotions and spirit are energetically wired — and how understanding that wiring
                can bring clarity, calm and strength into your daily life.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Using a unique method that overlays numerology onto the Chakra system, I offer
                insight into where your power is blocked, where it flows naturally and how to
                realign with your core self.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Experience */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">What You'll <span className="gradient-text">Experience</span></h2>
          <p className="section-subtitle">A structured, deeply personal journey through your energy body</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px' }}>
            {experiencePoints.map((point, i) => (
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
                  {point.num}
                </span>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.98rem' }}>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background */}
      <section style={{ padding: '80px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
              His work is rooted in over 1000 hours of certified Hatha-Vinyasa Yoga training in
              the Himalayas and decades of dedicated pilgrimages to sacred temples across India and
              Kathmandu — including the transformative experience of attending the Maha Kumbh, a
              powerful convergence of spiritual energies. It draws from a living lineage of ancient
              traditions, blending disciplined spiritual practice with research into ancient sciences
              and insights into energetic healing.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
              Whether you're navigating emotional stress, repeating life patterns or seeking a
              deeper connection to self, this reading reveals what's already within you — and how
              to bring it into harmony.
            </p>
          </div>
        </div>
      </section>

      {/* Clients Leave With */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">Clients Leave <span className="gold-text">With</span></h2>
          <p className="section-subtitle">Tangible shifts that stay with you long after the session</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '48px' }}>
            {clientLeaves.map((item, i) => (
              <div key={i} className="card" style={{ padding: '36px 28px', textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.8rem',
                  color: 'var(--accent-purple-light)',
                  marginBottom: '16px',
                  display: 'inline-flex',
                  padding: '14px',
                  background: 'rgba(123,47,242,0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(123,47,242,0.15)',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{ padding: '60px 0 80px', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div className="intro-content">
            <p style={{ fontStyle: 'italic', color: 'var(--accent-gold)', fontSize: '1.15rem', marginBottom: 28, lineHeight: 1.8 }}>
              "In a world that pulls us outward, your Chakras are the path back inward — to clarity,
              vitality, and true presence."
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact'))}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent-purple-light)', fontSize: '1rem', textDecoration: 'underline', lineHeight: 1.75 }}
            >
              Contact Sharan for more information.
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
