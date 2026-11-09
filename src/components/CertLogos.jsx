import './CertLogos.css'

const LOGOS = [
  { img: '/logos/rys200.png', alt: 'RYS 200 Yoga Alliance', title: '24 Day TTC200', caption: 'Syllabus & Work Book' },
  { img: '/logos/retreat500.png', alt: 'Retreats RYS 500 Yoga Alliance', title: '10 Day Retreat', caption: 'Syllabus & Work Book', accent: true },
  { img: '/logos/rys300.png', alt: 'RYS 300 Yoga Alliance', title: '24 Day TTC300', caption: 'Syllabus & Work Book' },
  { img: '/logos/rys500.png', alt: 'RYS 500 Yoga Alliance', title: '24 Day TTC500', caption: 'Syllabus & Work Book' },
  { img: '/logos/shri-tantra.png', alt: 'Shri Tantra', title: 'Shri Tantra', caption: 'Syllabus & Work Book', contact: true },
]

/** The five Maharishi Yoga Peeth certification marks shown under the hero logo. */
export default function CertLogos() {
  return (
    <ul className="cert-logos">
      {LOGOS.map((l) => (
        <li key={l.img} className="cert-card">
          <img src={l.img} alt={l.alt} width="360" height="360" loading="lazy" className="cert-img" />
          <p className={`cert-title${l.accent ? ' cert-title--accent' : ''}`}>{l.title}</p>
          <p className="cert-caption">{l.caption}</p>
          {l.contact && (
            <div className="cert-contact">
              <span>Dates: Sidhharth Ji</span>
              <a href="tel:+919627724204">+91 9627724204</a>
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
