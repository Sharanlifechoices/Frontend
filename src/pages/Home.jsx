import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaStar, FaQuoteLeft, FaYoutube } from 'react-icons/fa'
import { TbNumbers, TbGeometry, TbYoga, TbEye } from 'react-icons/tb'
import './Home.css'

const YT_VIDEO_ID = '8kaINl2tsb4'
const YT_WATCH_URL = `https://youtu.be/${YT_VIDEO_ID}`

// ── Slide components (defined outside to avoid re-mounting on every render) ──

function SlideVideo({ playerId = 'yt-player', isMuted = true, onToggleMute, containerRef }) {
  return (
    <div className="carousel-slide slide-video" style={{ position: 'relative' }}>
      <div className="yt-cover-wrap" ref={containerRef}>
        <div id={playerId} />
        {onToggleMute && (
          <button
            className="yt-mute-toggle-btn"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        )}
      </div>
      <div className="yt-slide-tagline">
        <p>Get Peace, Clarity and Direction in Your Health, Relationships, Career and Money Matters.</p>
      </div>
    </div>
  )
}

function SlideNumerology() {
  return (
    <div className="carousel-slide slide-numerology">
      <div className="slide-orb slide-orb--purple-bright" />
      <div className="num-bg-numbers" aria-hidden="true">
        {['1','3','7','9','11','22','33'].map((n, i) => (
          <span key={i} className={`float-num fn-${i}`}>{n}</span>
        ))}
      </div>
      <div className="container slide-inner slide-inner--center">
        <span className="slide-badge slide-badge--purple">Ancient Science</span>
        <h1 className="slide-title">
          Discover What Your <span className="gradient-text">Numbers Reveal</span>
        </h1>
        <p className="slide-desc slide-desc--center">
          Your birthdate holds the blueprint of your destiny. Decode the hidden
          patterns shaping your career, relationships and life purpose.
        </p>
        <Link to="/numerology" className="btn-primary">
          Explore Numerology <FaArrowRight />
        </Link>
      </div>
    </div>
  )
}

function SlideBook() {
  return (
    <div className="carousel-slide slide-book">
      <div className="slide-orb slide-orb--gold" />
      <div className="slide-orb slide-orb--pink-soft" />
      <div className="container slide-inner slide-inner--center">
        <span className="slide-badge slide-badge--gold">Personal Consultation</span>
        <h1 className="slide-title">
          Begin Your <span className="gold-text">Transformation</span>
        </h1>
        <p className="slide-desc slide-desc--center">
          One session can change everything. Book a personal consultation with Sharan
          and discover your path to clarity, purpose and peace.
        </p>
        <button
          className="btn-gold"
          onClick={() => document.querySelector('.book-session-fab')?.click()}
        >
          Book a Session <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

const SLIDES = 3

const services = [
  {
    img: 'https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_400,c_limit/v1781609386/site/backgrounds/bg3.png',
    title: 'Numerology',
    desc: 'A Structured method to decode your birthdate revealing career paths, relationships patterns & life purpose.',
    link: '/numerology',
    accent: '#7b2ff2',
  },
  // TODO: BioGeometry temporarily removed, re-enable when ready
  // {
  //   img: 'https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_400,c_limit/v1781609486/site/misc/image2.png',
  //   title: 'BioGeometry',
  //   desc: 'An energy-balancing science that uses geometric shapes to harmonize your home or workspace, balance personal energy, reduce stress.',
  //   link: '/biogeometry',
  //   accent: '#ec4899',
  // },
  {
    img: 'https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_400,c_limit/v1781609489/site/misc/image3.png',
    title: 'Meditation & Breathwork',
    desc: 'Guided practice using classical pranayama and meditation to release stress, reset your nervous system and restore inner calm.',
    link: '/meditation-breathwork',
    accent: '#d4a853',
  },
  {
    img: 'https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_400,c_limit/v1781609484/site/misc/image.png',
    title: 'Chakra Reading',
    desc: 'A structured journey through your energy centres to unlock emotional clarity & offer energetic balance.',
    link: '/chakra-reading',
    accent: '#06b6d4',
  },
  {
    img: 'https://res.cloudinary.com/dbb5nj0ht/image/upload/f_auto,q_auto,w_500,c_limit/v1781609548/site/books/book-1.jpg',
    title: 'Books',
    desc: 'Discover written wisdom — numerology insights and life guidance distilled into pages you can return to anytime.',
    link: '/books',
    accent: '#ec4899',
  },
]

const testimonials = [
  {
    text: "Sharan's numerology session gave me the clarity I'd been searching for about my career change. It was spot-on and deeply personal.",
    name: 'R.K.',
    context: 'Career Clarity',
    stars: 5,
  },
  {
    text: 'The breathwork session was transformative. I felt years of stored tension release in just one sitting. I sleep better now.',
    name: 'M.L.',
    context: 'Emotional Release',
    stars: 5,
  },
  {
    text: 'After the BioGeometry adjustments, our home felt completely different — calmer, lighter. Even the kids noticed the change.',
    name: 'S.T.',
    context: 'Home Energy',
    stars: 5,
  },
]

const stats = [
  { number: '1000+', label: 'Sessions Conducted' },
  { number: '10+', label: 'Years Experience' },
  { number: '4', label: 'Core Disciplines' },
  { number: '15+', label: 'Countries Served' },
]

export default function Home() {
  // trackPos: 0=Book(clone) | 1=Video | 2=Numerology | 3=Book | 4=Video(clone)
  const [trackPos, setTrackPos] = useState(1)
  const [transEnabled, setTransEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const timerRef = useRef(null)
  const videoPlayingRef = useRef(false)
  const startTimerRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const ytContainerRef = useRef(null)

  // Which dot lights up (0-indexed)
  const activeDot = ((trackPos - 1) % SLIDES + SLIDES) % SLIDES

  const startTimer = () => {
    clearInterval(timerRef.current)
    if (videoPlayingRef.current) return  // don't slide while video is playing
    timerRef.current = setInterval(() => {
      setTransEnabled(true)
      setTrackPos(prev => prev + 1)
    }, 5000)
  }

  // Keep ref fresh to avoid stale closure in YT callback
  useEffect(() => { startTimerRef.current = startTimer })

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  // Creates (or re-creates) the YT player. `muteFlag` false = attempt unmuted playback —
  // only succeeds if invoked from a real user gesture (see toggleMute) or if the
  // browser's autoplay policy happens to allow it; onReady always syncs isMuted to
  // whatever the player actually ended up doing, since browsers may force-mute regardless.
  // `tryUnmuteOnReady` = attempt event.target.unMute() right after ready — used only for
  // the initial page-load mount, where we must request mute:1 (browsers refuse to
  // autoplay at all, not just force-mute, if autoplay is requested unmuted with no prior
  // user gesture) but still want sound if the browser's per-site engagement heuristics
  // happen to allow programmatic unmute anyway.
  const createPlayer = (muteFlag, startAt = 0, tryUnmuteOnReady = false) => {
    ytPlayerRef.current = new window.YT.Player('yt-player', {
      videoId: YT_VIDEO_ID,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        mute: muteFlag ? 1 : 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        ...(startAt > 0 ? { start: Math.floor(startAt) } : {}),
      },
      events: {
        onReady: (e) => {
          if (tryUnmuteOnReady) { try { e.target.unMute() } catch { /* engagement heuristics denied it — stays muted */ } }
          setIsMuted(e.target.isMuted())
        },
        onStateChange: (e) => {
          if (e.data === 1) { // PLAYING
            videoPlayingRef.current = true
            clearInterval(timerRef.current)
          } else if (e.data === 2 || e.data === 0) { // PAUSED or ENDED only
            videoPlayingRef.current = false
            startTimerRef.current?.()
          }
          // BUFFERING (3) — keep timer paused, do nothing
        },
      },
    })
  }

  // Muted → unmuted: player.unMute() via postMessage on an already-created player is
  // blocked by browser autoplay policy — destroying and recreating it *inside* the
  // click handler keeps it tied to the user gesture, which browsers do allow.
  const unmuteViaRecreate = () => {
    const t = ytPlayerRef.current?.getCurrentTime?.() || 0
    try { ytPlayerRef.current?.destroy?.() } catch (e) {}
    if (ytContainerRef.current) {
      const div = document.createElement('div')
      div.id = 'yt-player'
      ytContainerRef.current.insertBefore(div, ytContainerRef.current.firstChild)
    }
    createPlayer(false, t)
  }

  const toggleMute = () => {
    if (typeof ytPlayerRef.current?.getCurrentTime !== 'function') return // player not ready yet
    if (isMuted) {
      unmuteViaRecreate()
      setIsMuted(false)
    } else {
      ytPlayerRef.current.mute() // muting has no gesture restriction, no recreate needed
      setIsMuted(true)
    }
  }

  // YouTube IFrame API — pause auto-slide while video plays, resume on pause/end
  useEffect(() => {
    // Must request mute:1 here — browsers refuse to autoplay at all (not just force-mute)
    // if autoplay is requested unmuted with no prior user gesture. Start muted so playback
    // reliably begins, then opportunistically try to unmute right after.
    const setupPlayer = () => createPlayer(true, 0, true)

    if (window.YT && window.YT.Player) {
      setupPlayer()
    } else {
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script')
        tag.id = 'yt-api-script'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = setupPlayer
    }

    return () => {
      if (window.onYouTubeIframeAPIReady === setupPlayer)
        delete window.onYouTubeIframeAPIReady
    }
  }, [])

  // After transition finishes on a clone, snap to the real slide
  useEffect(() => {
    if (trackPos === SLIDES + 1) {
      const t = setTimeout(() => { setTransEnabled(false); setTrackPos(1) }, 700)
      return () => clearTimeout(t)
    }
    if (trackPos === 0) {
      const t = setTimeout(() => { setTransEnabled(false); setTrackPos(SLIDES) }, 700)
      return () => clearTimeout(t)
    }
  }, [trackPos])

  // Re-enable transition one frame after the instant snap
  useEffect(() => {
    if (!transEnabled) {
      const t = setTimeout(() => setTransEnabled(true), 50)
      return () => clearTimeout(t)
    }
  }, [transEnabled])

  const goNext = () => { setTransEnabled(true); setTrackPos(p => p + 1); startTimer() }
  const goPrev = () => { setTransEnabled(true); setTrackPos(p => p - 1); startTimer() }
  const goTo   = (i) => { setTransEnabled(true); setTrackPos(i + 1);     startTimer() }

  return (
    <>
      {/* ───── HERO CAROUSEL ───── */}
      <section className="hero-carousel">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${trackPos * 100}%)`,
            transition: transEnabled ? 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          }}
        >
          <SlideBook />       {/* clone — position 0 */}
          <SlideVideo
            isMuted={isMuted}
            containerRef={ytContainerRef}
            onToggleMute={toggleMute}
          /> {/* real — position 1 */}
          <SlideNumerology /> {/* real  — position 2 */}
          <SlideBook />       {/* real  — position 3 */}
          <SlideVideo playerId="yt-player-clone" /> {/* clone — position 4, no player */}
        </div>

        {/* Dots */}
        <div className="carousel-dots">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              className={`carousel-dot ${i === activeDot ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ───── WHAT I DO ───── */}
      <section className="what-i-do" style={{ background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <div className="section-divider" />
          <span className="section-label">Services</span>
          <h2 className="section-title">What I <span className="gradient-text">Do</span></h2>
          <p className="section-subtitle">
            Four transformative pathways to clarity — each rooted in ancient wisdom, refined for your modern life.
          </p>
          <div className="services-grid">
            {services.map((s, i) => (
              <Link to={s.link} key={i} className="service-card">
                <div className="service-card-glow" style={{ background: s.accent }} />
                <div className="service-icon">
                  <img src={s.img} alt={s.title} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-cta" style={{ color: s.accent }}>
                  Explore <FaArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-divider" />
          <span className="section-label">Client Stories</span>
          <h2 className="section-title">Transformations That <span className="gold-text">Speak</span></h2>
          <p className="section-subtitle">Real experiences from real people who found their clarity.</p>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <FaQuoteLeft className="testimonial-quote-icon" />
                <div className="testimonial-stars">
                  {[...Array(t.stars)].map((_, j) => <FaStar key={j} />)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-context">{t.context}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="cta-section" style={{ background: 'rgba(5,5,20,0.50)' }}>
        <div className="container">
          <div className="cta-block">
            <div className="cta-glow" />
            <span className="section-label">Take the First Step</span>
            <h2>Ready to Discover <span className="gradient-text">Your Path</span>?</h2>
            <p>Book a session and begin your journey toward clarity, purpose and inner peace.</p>
            <div className="cta-actions">
              <Link to="/books" className="btn-gold">
                Explore the Books <FaArrowRight />
              </Link>
              <Link to="/numerology" className="btn-outline">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
