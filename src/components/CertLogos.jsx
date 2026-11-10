import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import './CertLogos.css'

const WHATSAPP_NUMBER = '919627724204' // Sidhharth Ji
const AVAILABILITY_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I would like to check availability for the Shri Tantra course.')}`

const LOGOS = [
  { img: '/logos/rys200.png', alt: 'RYS 200 Yoga Alliance', title: '24 Day TTC200', to: '/courses/ttc200' },
  { img: '/logos/retreat500.png', alt: 'Retreats RYS 500 Yoga Alliance', title: '10 Day Retreat', to: '/courses/retreat-10-day', accent: true },
  { img: '/logos/rys300.png', alt: 'RYS 300 Yoga Alliance', title: '24 Day TTC300', to: '/courses/ttc300' },
  { img: '/logos/rys500.png', alt: 'RYS 500 Yoga Alliance', title: '24 Day TTC500', to: '/courses/ttc500' },
  { img: '/logos/shri-tantra.png', alt: 'Shri Tantra', title: 'Shri Tantra', to: '/courses/tantra', contact: true },
]

/** The five Maharishi Yoga Peeth marks under the hero logo; each opens its course page. */
export default function CertLogos() {
  return (
    <ul className="cert-logos">
      {LOGOS.map((l) => (
        <li key={l.img} className="cert-card">
          <Link to={l.to} className="cert-link" aria-label={`${l.title}: syllabus and workbook`}>
            <img src={l.img} alt={l.alt} width="360" height="360" loading="lazy" className="cert-img" />
            <p className={`cert-title${l.accent ? ' cert-title--accent' : ''}`}>{l.title}</p>
            <p className="cert-caption">Syllabus & Work Book</p>
          </Link>
          {l.contact && (
            <div className="cert-contact">
              <span>Dates: Sidhharth Ji</span>
              <a href={AVAILABILITY_LINK} target="_blank" rel="noopener noreferrer" className="cert-availability">
                <FaWhatsapp aria-hidden="true" /> Check Availability
              </a>
              <a href="https://www.maharishiyogapeeth.com" target="_blank" rel="noopener noreferrer">
                www.Maharishiyogapeeth.com
              </a>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
