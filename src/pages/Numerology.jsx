import FAQ from '../components/FAQ'
import { TbNumbers, TbBriefcase, TbHeart, TbCompass, TbUsers } from 'react-icons/tb'
import './ServicePage.css'

const whoIHelp = [
  { icon: <TbBriefcase />, title: 'Professionals', desc: 'At a career crossroads and needing clarity on direction, timing and next moves.' },
  { icon: <TbCompass />,   title: 'Students',     desc: 'Unsure of their path and looking to understand their natural strengths and purpose.' },
  { icon: <TbUsers />,     title: 'Business Owners', desc: 'Building strong teams and making aligned decisions through numerological insight.' },
  { icon: <TbHeart />,     title: 'Couples & Families', desc: 'Understanding compatibility, communication patterns and relationship dynamics.' },
]

const faqItems = [
  { q: 'What type of numerology do you practice?', a: 'I combine Vedic and Chinese numerology with grid-based profiling for a comprehensive character and life-path analysis that goes deeper than traditional methods.' },
  { q: 'Do I need to prepare anything before a session?', a: 'Just your full birthdate and the name on your birth certificate. No prior knowledge of numerology is needed — I guide you through everything.' },
  { q: 'Is this about predicting the future?', a: 'Not at all. Numerology reveals patterns tendencies and timing in your life. It helps you make better-informed decisions rather than telling you what will happen.' },
  { q: 'How long is a session?', a: 'A typical numerology session runs 60–90 minutes. It\'s thorough and personalized — not a generic reading.' },
  { q: 'Can numerology help with my child\'s education decisions?', a: 'Absolutely. Understanding your child\'s numerical profile can reveal their natural strengths, learning style and what kind of environment helps them thrive.' },
  { q: 'Is this available online?', a: 'Yes, sessions are available both in-person (Singapore) and via video call for clients anywhere in the world.' },
  { q: 'What is the session fee?', a: 'Sessions are priced at $96 and typically last one hour. If the conversation naturally runs longer or includes an additional person, that can be discussed and arranged during the session itself.' },
]

export default function Numerology() {
  return (
    <>
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(5,5,20,0.55), rgba(5,5,20,0.55)), url(https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_1920,c_limit/v1781609386/site/backgrounds/bg3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container hero-content">
          <h1 className="fade-in">
            <span className="gradient-text">Numerology</span>
          </h1>
          <p className="fade-in fade-in-delay-1">
            What if your birthdate held the clues to your career, relationships and life purpose?
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '100px 0', background: 'rgba(8,8,24,0.60)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="section-label" style={{ textAlign: 'left' }}>Numerology</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                As a professional numerologist, I combine the precision of ancient Vedic and Chinese
                numerology with a unique grid-based profiling system to decode the blueprint of your life.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                This isn't just number crunching. It's deep character analysis — designed to reveal
                your personality patterns natural strengths, emotional tendencies and even the timing
                of key life events. My custom-designed grids blend numerology with character archetypes
                and behavioural insights to map out your life cycles — giving you clarity on where you
                are, what's influencing you and what's coming next.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                Whether you're a working professional at a career crossroads, a student unsure of your
                direction, or a business owner looking to build a strong team, numerology offers
                something powerful insight. I help individuals understand their core energies, pinpoint
                hidden challenges and align with their strengths to make more confident, purpose-driven
                decisions.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                My sessions also dive into relationship dynamics — whether it's between partners,
                parents and children or team members — offering practical understanding of compatibility
                and communication patterns.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', margin: 0 }}>
                This work is not abstract. It's grounded, logical and directly applicable to real life.
                Clients leave our sessions feeling clearer about their direction, more confident in their
                decisions and better equipped to handle life's transitions.
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
                In a world full of noise and confusion, numerology is your personal GPS — showing you
                not just who you are, but who you're becoming.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Who I Help */}
      <section style={{ padding: '100px 0', background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <h2 className="section-title">Who I <span className="gold-text">Help</span></h2>
          <p className="section-subtitle">Sessions tailored to where you are in life</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '48px' }}>
            {whoIHelp.map((item, i) => (
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
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
    </>
  )
}
