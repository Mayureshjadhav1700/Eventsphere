
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react'
import '../css/FeaturedEvents.css'

const events = [
  {
    id: 1,
    title: 'Tech Innovation Expo 2026',
    category: 'Technology',
    date: 'December 18, 2026',
    venue: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'
  },
  {
    id: 2,
    title: 'Creative Photography Workshop',
    category: 'Workshop',
    date: 'December 22, 2026',
    venue: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600'
  },
  {
    id: 3,
    title: 'Entrepreneurship Summit',
    category: 'Business',
    date: 'January 10, 2027',
    venue: 'Bengaluru, Karnataka',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600'
  }
]

function FeaturedEvents() {
  return (
    <section className="featured-section" id="events">
      <div className="featured-heading">
        <div>
          <span className="section-tag">DON'T MISS OUT</span>
          <h2>Featured Events</h2>
          <p>Discover experiences worth looking forward to.</p>
        </div>

        <a href="#events" className="view-all">
          Explore all events <ArrowRight size={17} />
        </a>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <div className="event-image">
              <img src={event.image} alt={event.title} />
              <span className="event-category">{event.category}</span>
            </div>

            <div className="event-details">
              <h3>{event.title}</h3>

              <div className="event-info">
                <CalendarDays size={16} />
                <span>{event.date}</span>
              </div>

              <div className="event-info">
                <MapPin size={16} />
                <span>{event.venue}</span>
              </div>

              <a href="#events" className="event-link">
                View Details <ArrowRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedEvents
