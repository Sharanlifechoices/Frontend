import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa'
import './YouTubeShortsRow.css'

const VIDEO_ID = /^[\w-]{11}$/

/**
 * A horizontally scrollable row of YouTube Shorts (swipe, trackpad, or the arrow buttons).
 * Each card shows the thumbnail; the player iframe is only mounted for the short being played,
 * so ten videos do not load ten players. Ids that are not 11 characters are ignored.
 */
export default function YouTubeShortsRow({ ids }) {
  const trackRef = useRef(null)
  const [playing, setPlaying] = useState(null)
  const [brokenThumbs, setBrokenThumbs] = useState({})
  const videos = ids.filter((id) => VIDEO_ID.test(id))

  if (videos.length === 0) return null

  const scrollBy = (direction) => {
    const track = trackRef.current
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="shorts-wrap">
      <button type="button" className="shorts-arrow shorts-arrow--prev" onClick={() => scrollBy(-1)} aria-label="Scroll shorts left">
        <FaChevronLeft />
      </button>

      <ul className="shorts-track" ref={trackRef} aria-label="YouTube Shorts">
        {videos.map((id, index) => (
          <li className="shorts-card" key={id}>
            {playing === id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
                title={`YouTube Short ${index + 1}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : brokenThumbs[id] ? (
              <a className="shorts-fallback" href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer">
                <FaPlay /> Watch on YouTube
              </a>
            ) : (
              <button type="button" className="shorts-thumb" onClick={() => setPlaying(id)} aria-label={`Play short ${index + 1} of ${videos.length}`}>
                <img
                  src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  onError={() => setBrokenThumbs((prev) => ({ ...prev, [id]: true }))}
                />
                <span className="shorts-play" aria-hidden="true"><FaPlay /></span>
              </button>
            )}
          </li>
        ))}
      </ul>

      <button type="button" className="shorts-arrow shorts-arrow--next" onClick={() => scrollBy(1)} aria-label="Scroll shorts right">
        <FaChevronRight />
      </button>
    </div>
  )
}
