import FAQ from '../components/FAQ'
import { TbYoga, TbWind, TbMoodSmile, TbActivity, TbSparkles, TbHeartRateMonitor } from 'react-icons/tb'
import './ServicePage.css'

const whyJoin = [
  { icon: <TbWind />,            num: '01', title: 'Reduce Stress & Anxiety',       desc: 'Calm your nervous system and dissolve chronic tension through guided breathwork.' },
  { icon: <TbMoodSmile />,       num: '02', title: 'Improve Focus & Emotional Clarity', desc: 'Clear mental fog and gain perspective on patterns that keep you stuck.' },
  { icon: <TbSparkles />,        num: '03', title: 'Reconnect With Your Inner Self', desc: 'Deepen self-awareness through ancient mantra and meditation practices.' },
  { icon: <TbActivity />,        num: '04', title: 'Boost Energy & Immune Health',   desc: 'Restore your body\'s natural energy flow and strengthen vitality.' },
  { icon: <TbHeartRateMonitor />,num: '05', title: 'Release Emotional Tension',      desc: 'Gently release emotions stored in the body through breath and awareness.' },
]

const faqItems = [
  { q: 'Do I need prior meditation or yoga experience?', a: 'Not at all. Sessions are designed to meet you where you are — whether you\'re a complete beginner or have an existing practice. I guide you through every step.' },
  { q: 'What techniques do you teach?', a: 'I draw from classical practices including Pranayama, Yoga Nidra, Bhastrika, Kapalabhati, Anuloma Viloma and Vedic Mantra Meditation — tailored to what your body and mind need.' },
  { q: 'How quickly will I feel results?', a: 'Many clients feel a noticeable shift after the very first session — calmer mind deeper breathing and reduced tension. Lasting transformation builds with consistent practice.' },
  { q: 'Is this available as a group session?', a: 'Yes, both private one-on-one sessions and small group sessions are available. Group sessions are great for couples, families or small teams.' },
  { q: 'Can breathwork help with sleep issues?', a: 'Absolutely. Specific pranayama and yoga nidra techniques are highly effective for insomnia, restless sleep and difficulty winding down at night.' },
  { q: 'Are online sessions as effective as in-person?', a: 'Yes. The guided nature of these practices translates very well to video calls. Many of my regular clients attend exclusively online.' },
]

export default function MeditationBreathwork() {
  return (
    <>
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609394/site/backgrounds/bg6.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
        <div className="container hero-content">
          <h1 className="fade-in">
            Meditation & Yogic <span className="gradient-text">Breathwork</span>
          </h1>
          <p className="fade-in fade-in-delay-1">
            Your breath isn't just for surviving — it's your shortcut to thriving.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '100px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>Breathwork</p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', marginBottom: 40, fontWeight: 700, textAlign: 'left', lineHeight: 1.3 }}>
              Your Breath Isn't Just for Surviving —{' '}
              <span className="gradient-text">It's Your Shortcut to Thriving.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                In a fast-paced world that never stops, your breath is the one tool that can bring
                you back to balance — instantly.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Through his Meditation & Yogic Breathwork sessions, Sharan guides you into a deeper
                relationship with your body, mind and subtle energy system. Trained in classical
                techniques like Yoga Nidra, Pranayama, Bhastrika, Kapalabhati, Anuloma Viloma and
                Vedic Mantra Meditation, Sharan combines breath and awareness to help you restore
                vitality, clear internal blockages, and elevate your state of being.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Whether you're managing stress, recovering from burnout or simply feeling emotionally
                stuck — these techniques are proven to calm the nervous system, increase oxygen flow
                to the brain and enhance mental clarity.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Each session includes breath-led grounding, subtle body awareness and guided
                meditation with sound (including mantra and vibration-based practices) to awaken
                your energy centers — especially the Muladhara (root) Chakra, which governs
                stability and vitality.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                You don't need experience, flexibility or fancy gear. You just need a willingness
                to sit, breathe and tune inward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">Why <span className="gradient-text">Join?</span></h2>
          <p className="section-subtitle">What each session brings to your body, mind and life</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '48px' }}>
            {whyJoin.map((item, i) => (
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
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{ padding: '60px 0 80px', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: 20 }}>
              Sharan's approach is gentle, grounded and accessible — whether you're seated in
              Padmasana or on a chair. It's not about perfection. It's about presence.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--accent-gold)', fontSize: '1.15rem', lineHeight: 1.8, margin: 0 }}>
              "Let your breath become your medicine."
            </p>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </>
  )
}
