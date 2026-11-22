
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone
} from 'lucide-react'

import '../css/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <div className="footer-logo">
            <CalendarDays size={27} />
            <span>EventSphere</span>
          </div>

          <p>
            Discover events, connect with people and create
            unforgettable experiences.
          </p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="#events">Explore Events</a>
          <a href="#about">About Us</a>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#events">Technology</a>
          <a href="#events">Workshops</a>
          <a href="#events">Business Events</a>
        </div>

        <div className="footer-column footer-contact">
          <h3>Contact</h3>
          <p><Mail size={16} /> support@eventsphere.com</p>
          <p><MapPin size={16} /> Maharashtra, India</p>
          <p><Phone size={16} /> Contact Support</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 EventSphere. All rights reserved.
        </p>
        <p>Designed to bring people and events together.</p>
      </div>
    </footer>
  )
}

export default Footer
