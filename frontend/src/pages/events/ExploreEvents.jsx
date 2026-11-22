
import { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import '../../css/ExploreEvents.css'

const defaultEventImage =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'


function formatEventDate(dateTime) {
  if (!dateTime) return 'Date not available'

  const date = new Date(dateTime)

  if (Number.isNaN(date.getTime())) return 'Date not available'

  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}


function ExploreEvents() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/events')

        setEvents(response.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load events. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const categories = [
    ...new Set(events.map((event) => event.categoryName).filter(Boolean)),
  ]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.venue?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || event.categoryName === category

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Navbar />

      <main className="explore-page">
        <section className="explore-header">
          <span className="explore-tag">
            FIND YOUR NEXT EXPERIENCE
          </span>

          <h1>Explore Events</h1>

          <p>
            Discover exciting events, learn new things, and connect
            with people who share your interests.
          </p>
        </section>

        <section className="explore-content">
          <div className="explore-filters">
            <div className="explore-search">
              <Search size={20} />

              <input
                type="text"
                placeholder="Search events or locations..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All Categories</option>

              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="explore-results-heading">
            <h2>Available Events</h2>
            <span>
              {loading ? 'Loading...' : `${filteredEvents.length} events found`}
            </span>
          </div>

          {loading ? (
            <div className="explore-empty">
              <h3>Loading Events...</h3>
              <p>Please wait while we fetch available events.</p>
            </div>
          ) : error ? (
            <div className="explore-empty">
              <h3>Unable to Load Events</h3>
              <p>{error}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="explore-grid">
              {filteredEvents.map((event) => (
                <article
                  className="explore-card"
                  key={event.id}
                >
                  <img
                    src={defaultEventImage}
                    alt={event.title}
                  />

                  <div className="explore-card-body">
                    <span className="explore-event-category">
                      {event.categoryName}
                    </span>

                    <h3>{event.title}</h3>

                    <div className="explore-event-info">
                      <span>
                        <CalendarDays size={16} />
                        {formatEventDate(event.startTime)}
                      </span>

                      <span>
                        <MapPin size={16} />
                        {event.venue}
                      </span>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="explore-details-button"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="explore-empty">
              <h3>No events found</h3>

              <p>
                Try changing your search or category filter.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ExploreEvents
