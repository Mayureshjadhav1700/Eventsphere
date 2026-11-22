
import { Search, MapPin, ArrowRight } from 'lucide-react'
import '../css/Hero.css'

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-tag">DISCOVER • CONNECT • EXPERIENCE</span>

        <h1>
          Discover Events
          <span> That Inspire You.</span>
        </h1>

        <p>
          Find exciting events around you, connect with like-minded people,
          and create unforgettable experiences.
        </p>

        <div className="hero-search">
          <div className="search-field">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
            />
          </div>

          <div className="search-field">
            <MapPin size={20} />
            <input
              type="text"
              placeholder="Enter location"
            />
          </div>

          <button type="button">
            Explore <ArrowRight size={18} />
          </button>
        </div>

        <div className="hero-note">
          Explore conferences, workshops, exhibitions and more.
        </div>
      </div>

      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900"
          alt="People attending a conference"
        />
        <div className="hero-floating-card">
          <span className="floating-icon">✦</span>
          <div>
            <strong>Find Your Next Experience</strong>
            <small>Something exciting awaits you.</small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
