import { FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import './RetreatsContact.css'

export default function RetreatsContact() {
  return (
    <>
      <a
        href="mailto:yogisidharthrishikesh@gmail.com?cc=Sharan.mylifechoices@gmail.com"
        className="mail-us-fab"
        aria-label="Mail us"
      >
        <FaEnvelope className="mail-us-fab-icon" />
        <span>Mail Us</span>
      </a>
      <a
        href="https://wa.me/message/G6YFDMJ6RZJXN1"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-fab"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp className="contact-fab-icon" />
        <span>Contact Us</span>
      </a>
    </>
  )
}
